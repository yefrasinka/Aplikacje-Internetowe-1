document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map").setView([51.505, -0.09], 13);

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: 'Tiles © Esri'
    }).addTo(map);

    document.getElementById("showLocationBtn").addEventListener("click", () => {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude]).addTo(map)
          .bindPopup("You are here!")
          .openPopup();
      }, () => {
        alert("Geolocation permission denied or unavailable.");
      });
    });

    document.getElementById("downloadMapBtn").addEventListener("click", () => {
      leafletImage(map, function(err, canvas) {
        if (err) {
          console.error("Error exporting map:", err);
          return;
        }

        const rasterMapContainer = document.getElementById("rasterMap");
        rasterMapContainer.innerHTML = "";
        rasterMapContainer.appendChild(canvas);

        createPuzzlePieces(canvas);
      });
    });

    function createPuzzlePieces(canvas) {
      const pieceSize = 75;
      const shuffledPuzzleContainer = document.getElementById("shuffledPuzzle");
      shuffledPuzzleContainer.innerHTML = "";

      let pieces = [];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const pieceCanvas = document.createElement("canvas");
          pieceCanvas.width = pieceSize;
          pieceCanvas.height = pieceSize;
          const ctx = pieceCanvas.getContext("2d");

          ctx.drawImage(
            canvas,
            col * pieceSize,
            row * pieceSize,
            pieceSize,
            pieceSize,
            0,
            0,
            pieceSize,
            pieceSize
          );

          const piece = document.createElement("div");
          piece.classList.add("puzzle-piece");
          piece.draggable = true;
          piece.dataset.row = row;
          piece.dataset.col = col;
          piece.appendChild(pieceCanvas);

          piece.addEventListener("dragstart", dragStart);
          piece.addEventListener("dragend", dragEnd);
          pieces.push(piece);
        }
      }

      pieces = pieces.sort(() => Math.random() - 0.5);
      pieces.forEach(piece => shuffledPuzzleContainer.appendChild(piece));
    }

    function dragStart(event) {
      event.dataTransfer.setData("text/plain", event.target.dataset.row + "," + event.target.dataset.col);
      event.target.style.opacity = "0.5";
    }

    function dragEnd(event) {
      event.target.style.opacity = "1"; 
    }

    const puzzleTarget = document.getElementById("puzzleTarget");

    puzzleTarget.addEventListener("dragover", event => {
      event.preventDefault();
    });

    puzzleTarget.addEventListener("drop", event => {
      event.preventDefault();
      const [row, col] = event.dataTransfer.getData("text").split(",");
      const piece = document.querySelector(`.puzzle-piece[data-row="${row}"][data-col="${col}"]`);

      if (piece) {
        const rect = puzzleTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const targetCellX = Math.floor(x / 75) * 75;
        const targetCellY = Math.floor(y / 75) * 75;

        const isCellOccupied = Array.from(puzzleTarget.children).some(child => {
          return parseInt(child.style.left) === targetCellX && parseInt(child.style.top) === targetCellY;
        });

        if (!isCellOccupied) {
          piece.style.position = "absolute";
          piece.style.left = `${targetCellX}px`;
          piece.style.top = `${targetCellY}px`;
          piece.style.zIndex = 20;
          piece.draggable = false; 
          puzzleTarget.appendChild(piece);
        } else {
          alert("This cell is already occupied!");
        }
      }
    });

    document.getElementById("checkPuzzleBtn").addEventListener("click", () => {
      let isPuzzleCorrect = true;
      const pieces = document.querySelectorAll(".puzzle-piece");

      pieces.forEach(piece => {
        const pieceRow = parseInt(piece.dataset.row);
        const pieceCol = parseInt(piece.dataset.col);
        const pieceX = parseInt(piece.style.left) / 75;
        const pieceY = parseInt(piece.style.top) / 75;

        if (pieceRow !== pieceY || pieceCol !== pieceX) {
          isPuzzleCorrect = false;
        }
      });

      if (isPuzzleCorrect) {
        alert("Puzzle is correctly assembled!");
        console.log("Puzzle is correctly assembled!");
      } else {
        alert("Puzzle is not correct yet.");
        console.log("Puzzle is not correct yet.");
      }
    });
});
