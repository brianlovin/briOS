# Mac CI

On Brian's configured Mac, commit, then push normally. The pre-push hook verifies the exact pushed commit in a temporary checkout, publishes an Ed25519 signed receipt, then permits the branch push. Dirty workspace files, dotenv files and the development server are left alone.

Setup: use Node 22, Bun 1.3.3 and authenticated `gh`, then run `bun install --frozen-lockfile` and `bun run ci:setup`. Setup installs the tracked hook and registers only the public key as `BRIOS_LOCAL_CI_PUBLIC_KEY` on brianlovin/briOS. It refuses to replace an existing different key or hook manager. Future installs (including Conductor setup) install the hook through `prepare`.

Daily commands:

```sh
git add <files>
git commit -m "Your change"
git push -u origin HEAD
```

`bun run ci:verify` verifies committed HEAD early without publishing. A subsequent push reuses a valid signed result. Rebase onto current origin/main when the base advances. PRs targeting other bases require disabling local mode and remote verification; they never silently use main's receipt.

Both paths use `scripts/ci/verify.mjs`: CI regression tests, ESLint, every application test file, and the production Next.js build including TypeScript checking. Bun test files run in separate processes because module mocks leak between files. Installation is frozen. The build uses placeholder credentials; developer environment variables are filtered out, and no deployments or source-map uploads are authorized by the runner.

GitHub executes the receipt verifier from the trusted PR base. The receipt binds repository, head, tree, base, verification policy, timestamp, Node and Bun versions, and Mac platform. Policy includes CI scripts, hooks, workflows, and root configuration files. Changed policy, missing/invalid signatures, stale receipts (seven days), future timestamps (over five minutes), changed base, forks, or a different merge tree require full remote verification. Cached receipts are authenticated before reuse. A failed decision cannot satisfy the required `build` check.

The first rollout PR must run remotely. After it merges, ordinary PRs with matching receipts skip dependency installation, lint, tests, and build on GitHub. Two small GitHub-hosted jobs remain. Main pushes still run full remote verification. Vercel remains required; image compression and scheduled likes sync are unchanged. GitHub requires branches to be up to date and administrators to respect checks.

Configuration and a separate private key live in `~/.config/local-ci/brianlovin/briOS/` with private permissions. Set `enabled` to `false` in `config.json` to disable local verification; unconfigured Macs, cloud sessions, and disabled mode use remote CI. Run the usual `bun run lint` preflight there. Re-run setup to enable. Never copy this directory to cloud workspaces or dotenv files.

This Mac account is a trusted runner. A process or agent controlling the account can read its key and forge results. Clean snapshots and environment filtering are not a security sandbox against the account.

For rotation, deliberately remove the GitHub public-key variable, archive/delete this repository's key and config, and rerun setup. For revocation, remove `BRIOS_LOCAL_CI_PUBLIC_KEY`; receipts then fall back remotely. Existing green checks are not retroactively revoked: rerun or update open PRs when revocation must block them.

Receipts are small source-free commits under `refs/notes/brios-ci/<head>/<base>`. Parallel sessions use independent refs and atomic cache files; refreshes use exact leases. To clean up an obsolete receipt, delete its exact ref with `git push origin :refs/notes/brios-ci/<head>/<base>`. Delete old JSON files in the config directory's `receipts/` subdirectory to clear local cache. Deletion never removes application branches. Receipt publication failure blocks the branch push; retry reuses the cached verification.
