# setup-nomad-pack

The `ksatirli/setup-nomad-pack` action is a JavaScript action that sets up
HashiCorp [nomad-pack](https://www.nomadproject.io) in your GitHub Actions workflow by:

- Installing a specific version of `nomad-pack` and adding it to `PATH`.

## Example Workflow

## Inputs

- `version` - (required) The version of `nomad-pack` to install. Supports
  [semver](https://www.npmjs.com/package/semver) versioning. Defaults to
  `latest`.

## Outputs

- `version` -  The version of `nomad-pack` that was installed.

