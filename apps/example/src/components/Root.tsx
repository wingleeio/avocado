export const Root = ({ children }) => (
    <html>
        <head>
            <title>Avocado</title>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://unpkg.com/htmx.org@2.0.1" />
            <script src="https://unpkg.com/htmx-ext-sse@2.2.0/sse.js" />
            <link href="./index.css" rel="stylesheet" />
        </head>
        <body>{children}</body>
    </html>
);
