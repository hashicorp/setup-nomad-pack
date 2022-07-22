# setup-nomad-pack

The `ksatirli/setup-nomad-pack` action is a JavaScript action that sets up
HashiCorp [nomad-pack](https://www.nomadproject.io) in your GitHub Actions workflow by:

- Installing a specific version of `nomad-pack` and adding it to `PATH`.

## Example Workflow

```yaml
name: nomad-pack Workflow

on:
  - push

jobs:
  setup-nomad-pack:
    runs-on: ubuntu-latest
    name: Run Nomad Pack
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup `nomad-pack`
        uses: ksatirli/setup-nomad-pack@v1
        id: setup
        with:
          version: 'latest'

      - name: Print version output
        run: echo "${{ steps.setup.outputs.version }}"

      - name: Run `nomad-pack version`
        run: nomad-pack version
```

## Inputs

- `version` - (required) The version of `nomad-pack` to install. Supports [semver](https://www.npmjs.com/package/semver) versioning. Defaults to `latest`.

## Outputs

- `version` -  The version of `nomad-pack` that was installed.
