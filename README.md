# Community Credit

A cooperative system between you and your friends for borrowing and sharing personal items.

Technology stack: VueJS, Express/Node, PostgreSQL, Cloudinary for hosting images.

This is currently in development and not yet stable for production.

# Setup and Environment variables

This application uses various environment variables for external services:

- `CLOUDINARY_URL` - Application uses [Cloudinary](https://cloudinary.com/) to host images and perform transformations.
- `DATABASE_URL` - Postgres database url.
- `SLACK_CLIENT_ID`
- `SLACK_CLIENT_SECRET`
- `SLACK_WEBHOOKS_REQUESTS_URL` - Slack incoming webhook url for posting new requests.
- `SLACK_WEBHOOKS_NEWITEMS_URL` - Slack incoming webhook url for posting new items.
- `SLACK_WEBHOOKS_ITEM_ACTIVITY_URL` - Slack incoming webhook url for posting item activity.
- `JWT_SECRET` - Secret used for encoding json web tokens
- `BASE_URL` - Base Url of the server

These environment variables need to be configued in an `.env` in the root directory in the format of CLOUDINARY_URL=https://...

When creating new frontend builds via Vue CLI, another `.env` files should be created in the `/dev/config` folder with environment variables:

- `SLACK_CLIENT_ID`
- `SLACK_SCOPES`
- `BASE_URL`

# Deployment

This application uses Heroku in production. To create a build, copy the server folder and create a build via [Vue Cli](https://github.com/vuejs/vue-cli). Transfer the created `dist` folder to the production folder.