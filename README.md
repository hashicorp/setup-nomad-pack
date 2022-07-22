# setup-nomad-pack

The `hashicorp/setup-nomad-pack` action is a JavaScript action that sets up the `nomad-pack` CLI in your GitHub Actions workflow by adding the binary to `PATH`.

After you've used the action, subsequent steps in the same job can run arbitrary `nomad-pack` commands using [the GitHub Actions `run` syntax](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsrun).
This allows (most) `nomad-pack` commands to work exactly like they do on a local command line interface.

## Example Workflow

```yaml
name: nomad-pack

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
          version: '0.0.1-techpreview2'

      - name: Print version output
        run: echo "${{ steps.setup.outputs.version }}"

      - name: Run `nomad-pack version`
        run: nomad-pack version
```

## Inputs

- `version` - (required) The version of `nomad-pack` to install. Supports [semver](https://www.npmjs.com/package/semver) versioning. Defaults to `latest`.

## Outputs

- `version` -  The version of `nomad-pack` that was installed.


## Author Information

This module is maintained by the contributors listed on [GitHub](https://github.com/ksatirli/setup-nomad-pack/graphs/contributors).

The original code of this repository is based on work done by [Matthew Sanabria](https://github.com/sudomateo) as part of the [setup-packer](https://github.com/sudomateo/setup-packer) GitHub Action.

## License

Licensed under the Apache License, Version 2.0 (the "License").

You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an _"AS IS"_ basis, without WARRANTIES or conditions of any kind, either express or implied.

See the License for the specific language governing permissions and limitations under the License.
