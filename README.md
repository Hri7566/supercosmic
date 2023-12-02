# supercosmic

This is essentially Cosmic "2.0", but I don't intend to strictly remake everything, it's more of a spiritual successor that shares the name.

Cosmic was a space-themed economy bot that could run on multiple different services, such as Discord and Multiplayer Piano. Initially, it was my learning project. I would implement bad things to learn why they're bad.

Supercosmic is another space-themed economy bot that streamlines tech that I consider new, yet sustainable and active. This way, the dependencies that I use aren't usually outdated.

To give an example, Supercosmic uses Bun.

I also plan to use hyperimport somehow in the future to edge into C++ or rust a bit.

## Usage

To install dependencies:

```bash
bun install
```

To copy envorionment variables:

```bash
cp .env.template .env
```

To setup Prisma (PostgreSQL required):

```bash
bunx prisma db push
```

To run:

```bash
bun .
```

## Configuring

Pretty much all of the available settings for things are in the `config` directory. If a config file doesn't exist, it is generated with default data at launch. Configs are only loaded once and are not yet hot-reloadable.

-   `balance.yml`: Balance (money) configuration
-   `mpp_net_channels.yml`: MPP.net channels to connect to
-   `roles.yml`: Roles and corresponding permissions
    -   There isn't a clean way to add roles yet. They're handled by an enum in the Prisma schema.
    -   In order to give someone a role, currently, the `/help` menu in the console can help you with that.
    -   Roles can be hierarchial by using the `inherits` property. The best explanation I have is that it works kind of like Lua metatables.
-   `services.yml`: List of services to connect to
    -   This file can control the connection to entire sites, i.e. MPP.net could be disabled, or the console
    -   If you receive crashes while using PM2 to host, turn off the console service.
-   `switchchat.yml`: SwitchCraft Chatbox config
    -   SwitchCraft 3 is a Minecraft server that primarily uses the ComputerCraft: Tweaked mod. They have a custom chat system that allows for user-created commands.

## Info

This project was created using `bun init` in bun v1.0.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
