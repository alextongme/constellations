// import * as paper from 'paper';

// // window.onload = function() {
//     // Get a reference to the canvas object
//     let canvas = document.getElementById('random');
//     // Create an empty project and a view for the canvas:
//     paper.setup(canvas);
//     // // Create a Paper.js Path to draw a line into it:
//     // var path = new paper.Path();
//     // // Give the stroke a color
//     // path.strokeColor = 'black';
//     // var start = new paper.Point(100, 100);
//     // // Move to start and draw a line from there
    
//     // // Note that the plus operator on Point objects does not work
//     // // in JavaScript. Instead, we need to call the add() function:
//     // path.lineTo(start.add([ 200, -50 ]));
//     // // Draw the view now:
    


// // The amount of circles we want to make:
// let count = 150;

// // Create a symbol, which we will use to place instances of later:
// let path = new paper.Path.Circle({
// 	center: [0, 0],
// 	radius: 10,
// 	fillColor: 'black',
// 	strokeColor: 'black'
// });

// let symbol = new paper.Symbol(path);

// // Place the instances of the symbol:
// for (let i = 0; i < count; i++) {
// 	// The center position is a random point in the view:
// 	let center = paper.Point.random() * paper.view.size;
// 	let placedSymbol = symbol.place(center);
// 	placedSymbol.scale(i / count);
// }

// paper.view.draw();

// // The onFrame function is called up to 60 times a second:
// function onFrame(event) {
// 	// Run through the active layer's children list and change
// 	// the position orf the placed symbols:
// 	for (let i = 0; i < count; i++) {
// 		let item = paper.project.activeLayer.children[i];
		
// 		// Move the item 1/20th of its width to the right. This way
// 		// larger circles move faster than smaller circles:
// 		item.position.x += item.bounds.width / 20;

// 		// If the item has left the view on the right, move it back
// 		// to the left:
// 		if (item.bounds.left > paper.view.size.width) {
// 			item.position.x = -item.bounds.width;
// 		}
// 	}
// }

// onFrame();
// // }
