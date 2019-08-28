workflow "Build, Flow, Cypress" {
  on = "push"
  resolves = ["Cypress"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}

action "Flow" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Install"]
  args = "run flow"
}

action "Build" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Flow"]
  args = "run build"
}

action "Start" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Build"]
  args = "run start"
}

action "Cypress" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Start"]
  args = "run cypress:run"
}
