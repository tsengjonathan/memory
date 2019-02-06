defmodule MemoryWeb.GamesChannel do
    use MemoryWeb, :channel

    alias Memory.Game
    alias Memory.BackupAgent
    
    def join("games:" <> name, payload, socket) do
        if authorized?(payload) do
          game = BackupAgent.get(name) || Game.new()
          BackupAgent.put(name, game)
          socket = socket
          |> assign(:game, game)
          |> assign(:name, name)
          {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
        else
          {:error, %{reason: "unauthorized"}}
        end
      end
    
      def handle_in("flip", %{"card" => idx}, socket) do
        name = socket.assigns[:name]
        game = Game.flip(socket.assigns[:game], idx)
        socket = assign(socket, :game, game)
        BackupAgent.put(name, game)
        {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
      end

      def handle_in("close", %{}, socket) do
        name = socket.assigns[:name]
        game = Game.close(socket.assigns[:game])
        socket = assign(socket, :game, game)
        BackupAgent.put(name, game)
        {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
      end

      def handle_in("reset", %{}, socket) do
        name = socket.assigns[:name]
        game = Game.new()
        socket = assign(socket, :game, game)
        BackupAgent.put(name, game)
        {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
      end
    
      # Add authorization logic here as required.
      defp authorized?(_payload) do
        true
      end
end