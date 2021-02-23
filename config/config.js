let config = {};

if (Deno.env.get('DATABASE_URL')) {
  config.database = Deno.env.get('DATABASE_URL');
} else {
  config.database = {
    hostname: "",
    database: "",
    user: "",
    password: "",
    port: 5432
  };
}

config.port = 7777;
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1];
    config.port = Number(lastArgument);
}

export { config };
