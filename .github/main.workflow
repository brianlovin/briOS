workflow "Build, Test, and Publish" {
  on = "push"
  resolves = ["E2E Tests"]
}

action "Build" {
  uses = "actions/npm@master"
  args = "install"


action "Flow" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Build"]
  args = "run flow"
}

action "E2E Tests" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Flow"]
  args = "run cypress:run"
}
