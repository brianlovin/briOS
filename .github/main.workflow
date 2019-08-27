workflow "Test my code" {
  on = "push"
  resolves = ["npm test"]
}

action "npm ci" {
  uses = "docker://node:alpine"
  runs = "npm"
  args = "ci"
}

action "npm test" {
  needs = "npm ci"
  uses = "docker://node:alpine"
  runs = "npm"
  args = "test"
}

action "E2E Tests" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Unit Tests"]
  args = "run cypress:run"
}
