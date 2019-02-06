defmodule Memory.Game do
    def new do
        %{
            tiles: randomize_arr(const_tiles()),
            clicks: 0,
            log: []
        }
    end

    def client_view(game) do
        %{
            tiles: Enum.map(game.tiles, fn e -> 
                if e.isOpen do e else %{isOpen: false, isSolved: false, label: ""} end
            end),
            clicks: game.clicks,
            log: 
            cond do 
                length(game.log) === 0 -> [] 
                rem(length(game.log), 2) === 0 -> [hd(game.log), hd(tl(game.log))] 
                true -> [hd(game.log)] 
            end
            # if rem(length(game.log), 2) === 0 do [hd(game.log), hd(tl(game.log))] else [hd(game.log)] end
        }
    end

    def flip(game, idx) do
        %{
            tiles: List.replace_at(game.tiles, idx, %{isOpen: true, isSolved: false, label: Enum.at(game.tiles, idx).label}),
            clicks: game.clicks + 1,
            log: [idx] ++ game.log
        }
    end

    def close(game) do
        if Enum.at(game.tiles, hd(game.log)) === Enum.at(game.tiles, hd(tl(game.log))) do
            label = Enum.at(game.tiles, hd(game.log)).label
            %{
                tiles: Enum.map(game.tiles, fn e -> 
                    if e.label === label do %{isOpen: true, isSolved: true, label: label} else e end 
                end),
                clicks: game.clicks,
                log: []
            }
        else
            %{
                tiles: Enum.map(game.tiles, fn e -> 
                    if e.isOpen and not(e.isSolved) do %{isOpen: false, isSolved: false, label: e.label} else e end 
                end),
                clicks: game.clicks,
                log: []
            }
        end
    end

    def const_tiles() do
        [
            %{isOpen: false, isSolved: false, label: "A"},
            %{isOpen: false, isSolved: false, label: "A"},
            %{isOpen: false, isSolved: false, label: "B"},
            %{isOpen: false, isSolved: false, label: "B"},
            %{isOpen: false, isSolved: false, label: "C"},
            %{isOpen: false, isSolved: false, label: "C"},
            %{isOpen: false, isSolved: false, label: "D"},
            %{isOpen: false, isSolved: false, label: "D"},
            %{isOpen: false, isSolved: false, label: "E"},
            %{isOpen: false, isSolved: false, label: "E"},
            %{isOpen: false, isSolved: false, label: "F"},
            %{isOpen: false, isSolved: false, label: "F"},
            %{isOpen: false, isSolved: false, label: "G"},
            %{isOpen: false, isSolved: false, label: "G"},
            %{isOpen: false, isSolved: false, label: "H"},
            %{isOpen: false, isSolved: false, label: "H"}
        ]
    end

    def randomize_arr(arr) do
        # not truly random, but good enough
        Enum.sort(arr, fn (_a, _b) -> Enum.random(1..10_000) > Enum.random(1..10_000) end)
    end
end