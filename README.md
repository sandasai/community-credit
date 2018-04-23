# Environment variables:

Multiple environment variables will be need to set for use in production

- `CLOUDINARY_URL` Connection string for using cloudianry for storing images
- `DATABASE_URL` Connection string for database
- `SLACK_CLIENT_ID` For accessing slack app
- `SLACK_CLIENT_SECRET` For accessing slack app
- `SLACK_SCOPES` Comma delimited list of scopes for Slack OAuth
- `SLACK_WEBHOOKS_REQUESTS_URL` Url for incomming webhook for created requests
- `SLACK_WEBHOOKS_NEWITEMS_URL` Url for incomming webhook for created items
- `JWT_SECRET` JSON Web token secret
# community-credit
A cooperative system between you and your friends for borrowing and sharing personal items.

Technology stack: VueJS, Express/Node, PostgreSQL, Cloudinary for hosting images.

This is currently in development and not yet stable for production.
