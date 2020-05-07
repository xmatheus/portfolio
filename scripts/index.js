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
	let jsonResult = await myrequestJson(
		`https://api.github.com/users/${user}/repos?sort=created`
	);
	jsonResult.map((elem) => {
		let { full_name, svn_url } = elem;
		let repJson = null;
		setTimeout(async () => {
			try {
				repJson = await myrequestJson(
					`https://raw.githubusercontent.com/xmatheus/${
						full_name.split("/")[1]
					}/master/portifolio.json`
				);
				if (repJson) {
					let { name, icon, resume } = repJson;

					let a = document.querySelector(".containerCards");
					let card = document.createElement("div");
					card.className = "card";

					card.addEventListener("click", () => {
						let win = window.open(svn_url, "_blank");
						win.focus();
					});

					card.innerHTML += `<div>
							<ion-icon name="${icon}"></ion-icon>
						</div>
						<img src="/img/backgroundImages/${Math.floor(Math.random() * 38)}.png" alt="" />
						<section id="section-animation">
							<h2>${name}</h2>
							<p>
								${resume}
							</p>
						</section>`;

					a.appendChild(card);
				}
			} catch (err) {
				console.log("Err");
			}
		}, 300);
	});

	setTimeout(() => {
		setbackColors();
	}, jsonResult.length * 302); //qtd de repositorios * 305ms(setTimeout pra colocar as imagens e infos dos repositorios)
};

setbackColors = () => {
	let intervalColors = setInterval(() => {
		let img = document.querySelectorAll(".card img");
		if (img) {
			img.forEach((elem) => {
				let { r, g, b } = getAverageRGB(elem);
				elem.nextElementSibling.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
			});
			setTimeout(() => clearInterval(intervalColors), 500);
		}
	}, 50);
};

getRepos("xmatheus");

$("html, body").animate({ scrollTop: 0 }, "slow");
