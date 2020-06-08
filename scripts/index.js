function getAverageRGB(imgEl) {
	var blockSize = 5, // only visit every 5 pixels
		defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
		canvas = document.createElement("canvas"),
		context = canvas.getContext && canvas.getContext("2d"),
		data,
		width,
		height,
		i = -4,
		length,
		rgb = { r: 0, g: 0, b: 0 },
		count = 0;

	if (!context) {
		return defaultRGB;
	}

	height = canvas.height =
		imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
	width = canvas.width =
		imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

	context.drawImage(imgEl, 0, 0);

	try {
		data = context.getImageData(0, 0, width, height);
	} catch (e) {
		/* security error, img on diff domain */
		return defaultRGB;
	}

	length = data.data.length;

	while ((i += blockSize * 4) < length) {
		++count;
		rgb.r += data.data[i];
		rgb.g += data.data[i + 1];
		rgb.b += data.data[i + 2];
	}

	// ~~ used to floor values
	rgb.r = ~~(rgb.r / count);
	rgb.g = ~~(rgb.g / count);
	rgb.b = ~~(rgb.b / count);

	return rgb;
}

let myrequestJson = async (url) => {
	try {
		const result = await fetch(url);
		let jsonResult = await result.json();
		return jsonResult;
	} catch (error) {
		return null;
	}
};

const getRepos = async (user) => {
	let result = await myrequestJson("portifolio.json");

	result.map((elem) => {
		let { name, icon, resume, github } = elem;

		let a = document.querySelector(".containerCards");
		let card = document.createElement("div");
		card.className = "card";

		card.addEventListener("click", () => {
			let win = window.open(github, "_blank");
			win.focus();
		});

		let img = document.createElement("img");
		img.src = `img/${Math.floor(Math.random() * 37) + 1}.webp`; //localhost -> remove /portifolio
		img.alt = "background image";

		let div = document.createElement("div");
		let ionicon = document.createElement("ion-icon");
		ionicon.name = icon;
		div.appendChild(ionicon);

		let mysection = document.createElement("section");
		mysection.id = "section-animation";

		let myh2 = document.createElement("h2");
		myh2.innerText = name;

		let myp = document.createElement("p");
		myp.innerText = resume;

		mysection.appendChild(myh2);
		mysection.appendChild(myp);

		img.addEventListener("load", () => {
			setTimeout(() => {
				let { r, g, b } = getAverageRGB(img);
				mysection.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
				// console.log(img, "complete");
			}, 1000);
		});

		card.appendChild(div);
		card.appendChild(img);
		card.appendChild(mysection);

		a.appendChild(card);
	});
};

// setbackColors = () => {
// 	let img = document.querySelectorAll(".card img");
// 	if (img) {
// 		img.forEach((elem) => {
// 			let { r, g, b } = getAverageRGB(elem);
// 			elem.nextElementSibling.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
// 		});
// 	}
// };

getRepos("xmatheus");
