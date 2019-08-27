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

action "Build API" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Flow"]
  args = "run build"
}

action "Start Dev" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Build API"]
  args = "run dev:api"
}

action "Start API" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Start Dev"]
  args = "run start"
}

action "Cypress" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Start API"]
  args = "run cypress:run"
}
