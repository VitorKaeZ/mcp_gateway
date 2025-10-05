# MCP Gateway

This project is a monorepo containing the MCP Gateway and its associated tools.

## Overview

The MCP Gateway is a Node.js application that acts as a central hub for the Model-Context-Protocol (MCP). It provides a secure and scalable way to manage and interact with MCP tools.

This monorepo also includes the following tools:

*   **Weather Tool:** A command-line tool that provides weather information.

## Features

*   **User Authentication:** Secure user authentication using JWT and OAuth2.
*   **Tool Management:** A flexible tool management system that allows you to easily add and remove tools.
*   **Scalable Architecture:** A scalable architecture that can handle a large number of users and tools.
*   **Extensible:** The gateway is designed to be easily extensible with new features and functionality.

## Getting Started

### Prerequisites

*   Node.js
*   npm

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/mcp-gateway.git
    ```

2.  Install the dependencies for the gateway:

    ```bash
    cd packages/gateway
    npm install
    ```

3.  Install the dependencies for the weather tool:

    ```bash
    cd ../tools/weather
    npm install
    ```

### Running the Gateway

1.  Create a `.env` file in the `packages/gateway` directory and add the following environment variables:

    ```
    PORT=3333
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_SECRET_ID=your-google-secret-id
    ```

2.  Start the gateway in development mode:

    ```bash
    npm run dev
    ```

3.  The gateway will be available at `http://localhost:3333`.

### Running the Weather Tool

1.  Start the weather tool in development mode:

    ```bash
    npm run dev
    ```

## Contributing

Contributions are welcome! Please see our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more information.
