# Security

Please report a security problem privately, not in a public issue. On this
repo's GitHub page, open the **Security** tab and choose **Report a
vulnerability**. Only the maintainers see the report.

Useful details: what an attacker can do, the input or steps that show it,
and the version (the commit) you tested.

Fixes go into the latest release and `main`; older releases are not patched.

The tools open the page named in the config in a headless browser and run
measuring code in it. Problems such as a config value that runs code
outside the page are in scope.
