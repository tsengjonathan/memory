# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :memory, MemoryWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: get_secret(),
  render_errors: [view: MemoryWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Memory.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

get_secret = fn name ->
  # Secret generation hack by Nat Tuck for CS4550
  # This function is dedicated to the public domain.
  base = Path.expand("~/.config/phx-secrets")
  File.mkdir_p!(base)
  path = Path.join(base, name)
  unless File.exists?(path) do
    secret = Base.encode16(:crypto.strong_rand_bytes(32))
    File.write!(path, secret)
  end
  String.trim(File.read!(path))
end
