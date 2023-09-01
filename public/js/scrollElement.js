// makes a section draggable via mouse
// invoke via: clickAndDrag(.classname)

export function clickAndDrag(selector, classOnEvent = 'grabbed_elem') {
	const slider = document.querySelector(selector);
	let isDown = false;
	let startX;
	let scrollLeft;

	slider.addEventListener('mousedown', (e) => {
		e.preventDefault();
		isDown = true;
		slider.classList.add(classOnEvent);
		startX = e.pageX - slider.offsetLeft;
		scrollLeft = slider.scrollLeft;

		console.log('startx is: ' + startX);
		console.log('scrollleft is: ' + scrollLeft);

		// prevent default child behavior
		document.body.addEventListener('click', function (event) {
			if (slider.contains(event.target)) {
				event.preventDefault();
			}
		});
	});

	slider.addEventListener('mouseleave', () => {
		isDown = false;
		slider.classList.remove(classOnEvent);
	});

	slider.addEventListener('mouseup', () => {
		isDown = false;
		slider.classList.remove(classOnEvent);
	});

	slider.addEventListener('mousemove', (e) => {
		if (!isDown) {
			return;
		}
		e.preventDefault();
		slider.scrollLeft = scrollLeft - e.pageX + slider.offsetLeft + startX;
		console.log('slider scrollleft is: ' + slider.scrollLeft);
	});
}
