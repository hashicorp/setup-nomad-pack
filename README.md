# setup-nomad-pack

The `hashicorp/setup-nomad-pack` Action sets up the `nomad-pack` CLI in your GitHub Actions workflow by adding the binary to `PATH`.

## Table of Contents

- [setup-nomad-pack](#setup-nomad-pack)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Usage](#usage)
  - [Author Information](#author-information)
  - [License](#license)

## Requirements

This GitHub Actions supports all commands that are available in the `nomad-pack` CLI.

The `run`, `destroy`, `info`, and `status` commands require access to a Nomad cluster, as defined through the environment variable `NOMAD_ADDR`. Other [environment variables](https://www.nomadproject.io/docs/commands#environment-variables) (such as `NOMAD_TOKEN`) may be set as normal and will be picked up accordingly.

## Usage

1.) Create GitHub Actions Secrets by going to the repository's _Settings_ tab, followed by expanding the _Secrets_ sidebar, and finally _Actions_.

- Set the `NOMAD_ADDR` to the IP-address or hostname of a Nomad cluster that is routable for GitHub Actions Runners.
- Set the `NOMAD_TOKEN` to a token with appropriate permissions to carry out Pack-specific operations on a Nomad cluster.

Optionally, set any and all [environment variables](https://www.nomadproject.io/docs/commands#environment-variables) as required for your Nomad cluster.

> **Warning**
> Running services such as Nomad on a publicly accessible port without authentication is a decidedly bad idea.
>
> Consult with your security team to define an access policy that meets your organization's security demands.

<small>GitHub Actions run on a publicly-known list of [IP addresses](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#ip-addresses).
This data may be retrieved through [HashiCorp Terraform](https://terraform.io/), using the [ip_ranges data source](https://registry.terraform.io/providers/integrations/github/latest/docs/data-sources/ip_ranges), allowing you to make IP-address _one_ of the security considerations.</small>

2.) Create a GitHub Actions Workflow file (e.g.: `.github/workflows/nomad-pack.yml):

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
        # TODO: define `v1`
        uses: hashicorp/setup-nomad-pack@v1
        id: setup
        with:
          version: "0.0.1-techpreview2"

      - name: Run `nomad-pack info` for `simple_service`
        id: info
        run: "nomad-pack info ./packs/simple_service"

      - name: Run `nomad-pack run` for `simple_service`
        id: run
        run: "nomad-pack run ./packs/simple_service"
        env:
          NOMAD_ADDR: "${{ secrets.NOMAD_ADDR }}"
          NOMAD_TOKEN: "${{ secrets.NOMAD_TOKEN }}"
        continue-on-error: true
```

In the above example, the following definitions have been set.

- The event trigger has been set to `push`. For a complete list, see [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows).
- The origin of this GitHub Action has been set as `ksatirli/setup-nomad-pack@0.1.3`. For newer versions, see the [Releases](https://github.com/ksatirli/setup-nomad-pack/releases).
- The version of `nomad-pack` to set up has been set as `0.0.1-techpreview2`. For a complete list, see [releases.hashicorp.com](https://releases.hashicorp.com/nomad-pack/).
- The pack to deploy has been set as `./packs/simple_service`

These definitions may require updating to suit your deployment, such as specifying [self-hosted](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#choosing-self-hosted-runners) runners.

Additionally, you may configure [outputs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-defining-outputs-for-a-job) to consume return values from the Action's operations.

## Inputs

This section contains a list of all inputs that may be set for this Action.

- `version` - (required) The version of `nomad-pack` to install. Supports [semver](https://www.npmjs.com/package/semver) versioning. Defaults to `0.0.1-techpreview2`.

## Outputs

This section contains a list of all outputs that can be consumed from this Action.

- `version` -  The version of `nomad-pack` that was installed.

## Author Information

This module is maintained by the contributors listed on [GitHub](https://github.com/ksatirli/setup-nomad-pack/graphs/contributors).

The original code of this repository is based on work done by [Matthew Sanabria](https://github.com/sudomateo) as part of the [setup-packer](https://github.com/sudomateo/setup-packer) GitHub Action.

## License

Licensed under the Apache License, Version 2.0 (the "License").

You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an _"AS IS"_ basis, without WARRANTIES or conditions of any kind, either express or implied.

See the License for the specific language governing permissions and limitations under the License.
