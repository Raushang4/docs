# Paycrest Documentation

Developer documentation for the Paycrest protocol.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Bonadocs Playground Setup

To set up and use the Bonadocs playground for interacting with Paycrest's gateway contract and APIs, follow these steps:

1. **Create a Bonadocs Playground**:
   - Go to [Bonadocs](https://bonadocs.com) and create a new playground.
   - Add both USDT and the gateway contract on the chains where the gateway is deployed.

2. **Add Bonadocs Actions**:
   - Update the `docs/api.md` file to include Bonadocs actions for querying API endpoints using the `fetch` API in JavaScript.
   - Update the `docs/contracts/Gateway.md` file to include Bonadocs actions for interacting with the gateway contract to create orders.

3. **Configure Docusaurus**:
   - Update the `docusaurus.config.js` file to include Bonadocs playground configuration.

4. **Run the Playground**:
   - Start the local development server using `yarn start`.
   - Access the Bonadocs playground through the documentation site.

## Contributing

We welcome contributions to the Paycrest docs! To get started, follow these steps:

**Important:** Before you begin contributing, please ensure you've read and understood these important documents:

- [Contribution Guide](https://paycrest.notion.site/Contribution-Guide-1602482d45a2809a8930e6ad565c906a) - Critical information about development process, standards, and guidelines.

- [Code of Conduct](https://paycrest.notion.site/Contributor-Code-of-Conduct-1602482d45a2806bab75fd314b381f4c) - Our community standards and expectations.

Our team will review your pull request and work with you to get it merged into the main branch of the repository.

If you encounter any issues or have questions, feel free to open an issue on the repository or leave a message in our [developer community on Telegram](https://t.me/+Stx-wLOdj49iNDM0)

## 📜 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

By using, modifying, or distributing this software, you agree to comply with the terms of the **AGPL-3.0** license.

For more details, see the [LICENSE](LICENSE) file or visit:  
[https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)
