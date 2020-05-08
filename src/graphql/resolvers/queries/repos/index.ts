function transform(repo) {
  return {
    org: repo.owner.login,
    name: repo.name,
    description: repo.description,
    stars: repo.stargazers_count,
  }
}

export async function getRepos() {
  return await fetch('https://api.github.com/users/brianlovin/repos')
    .then((res) => res.json())
    .then((res) => {
      return res
        .filter((res) => !res.fork)
        .sort((a, b) => a.stargazers_count <= b.stargazers_count)
        .map(transform)
        .slice(0, 5)
    })
    .catch(() => [])
}
