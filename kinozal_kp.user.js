// ==UserScript==
// @name               Рейтинг кинопоиска для kinozal.tv
// @namespace          https://github.com/mastdiekin/kinozal-kp
// @description:ru     Добавляет кнопку рейтинга, на главной странице и на странице топа http://kinozal.tv/top.php к раздачам.

// @include            http://kinozal.tv/*

// @version            1.0.6
// @author             mastdiekin
// @require            http://code.jquery.com/jquery-3.2.1.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js
// @icon               http://kinozal.tv/pic/favicon.ico

// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @description Добавляет кнопку рейтинга, на главной странице и на странице топа http://kinozal.tv/top.php к раздачам.
// ==/UserScript==

(function() {
	'use strict';
	let props = {
		_brand: '#f1d29c',
		brand: '#C0A067',
		transition: '.1s ease',
		buttonText: 'Рейтинг',
		requestText: 'Получить рейтинг',
	}

	let svg = `<svg enable-background="new 0 0 70 70" version="1.1" viewBox="0 0 70 70" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m35 0c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm-13.3 13.5c4.7 0 8.4 3.7 8.4 8.4s-3.7 8.4-8.4 8.4-8.4-3.7-8.4-8.4c0.1-4.7 3.8-8.4 8.4-8.4zm0 43c-4.7 0-8.4-3.7-8.4-8.4s3.7-8.4 8.4-8.4 8.4 3.7 8.4 8.4c-0.1 4.7-3.8 8.4-8.4 8.4zm9.7-17.9c-2-2-2-5.3 0-7.3s5.3-2 7.3 0 2 5.3 0 7.3-5.3 2.1-7.3 0zm16.9 17.9c-4.7 0-8.4-3.7-8.4-8.4s3.7-8.4 8.4-8.4 8.4 3.7 8.4 8.4c-0.1 4.7-3.8 8.4-8.4 8.4zm0-26.4c-4.7 0-8.4-3.7-8.4-8.4s3.7-8.4 8.4-8.4 8.4 3.7 8.4 8.4c-0.1 4.7-3.8 8.4-8.4 8.4z" fill="#ffffff"/></svg>`;
	let base64svg = `PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA3MCA3MCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNzAgNzAiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTM1IDBjLTE5LjMgMC0zNSAxNS43LTM1IDM1czE1LjcgMzUgMzUgMzUgMzUtMTUuNyAzNS0zNS0xNS43LTM1LTM1LTM1em0tMTMuMyAxMy41YzQuNyAwIDguNCAzLjcgOC40IDguNHMtMy43IDguNC04LjQgOC40LTguNC0zLjctOC40LTguNGMwLjEtNC43IDMuOC04LjQgOC40LTguNHptMCA0M2MtNC43IDAtOC40LTMuNy04LjQtOC40czMuNy04LjQgOC40LTguNCA4LjQgMy43IDguNCA4LjRjLTAuMSA0LjctMy44IDguNC04LjQgOC40em05LjctMTcuOWMtMi0yLTItNS4zIDAtNy4zczUuMy0yIDcuMyAwIDIgNS4zIDAgNy4zLTUuMyAyLjEtNy4zIDB6bTE2LjkgMTcuOWMtNC43IDAtOC40LTMuNy04LjQtOC40czMuNy04LjQgOC40LTguNCA4LjQgMy43IDguNCA4LjRjLTAuMSA0LjctMy44IDguNC04LjQgOC40em0wLTI2LjRjLTQuNyAwLTguNC0zLjctOC40LTguNHMzLjctOC40IDguNC04LjQgOC40IDMuNyA4LjQgOC40Yy0wLjEgNC43LTMuOCA4LjQtOC40IDguNHoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=`;
	let base64svg_imdb = `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCAzMiAzMiIgc3R5bGU9Ii1tcy10cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpOyAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7Ij48cGF0aCBkPSJNMTkuMDc4IDEyLjc4NnYuMDA1Yy0uMDk5LS4wNjMtLjMwMi0uMDk0LS41NTctLjA5NHY2LjQyMmMuMzU5IDAgLjU4My0uMDgzLjY2Ny0uMjI0Yy4wODMtLjEzNS4xMjUtLjUzNi4xMjUtMS4xNzd2LTMuODIzYzAtLjQzOC0uMDA1LS43MTktLjA0Mi0uODM5Yy0uMDMxLS4xMy0uMDg5LS4yMTktLjE4OC0uMjcxek0yOS44ODUgMEgyLjE2MUEyLjI5OSAyLjI5OSAwIDAgMCAwIDIuMTN2MjcuNzA4Yy4wNzggMS4xNjcuOTQ4IDIuMDU3IDIuMDczIDIuMTU2Yy4wMjEuMDA1LjA0Mi4wMDUuMDYzLjAwNWgyNy43OTJhMi4zMDMgMi4zMDMgMCAwIDAgMi4wNzMtMi4yODFWMi4yOGEyLjMgMi4zIDAgMCAwLTIuMTE1LTIuMjgxek02LjM5MSAyMC44MzNIMy44NDl2LTkuODE4aDIuNTQyem04LjcxOCAwaC0yLjIxNHYtNi42M2wtLjg5NiA2LjYyNWgtMS41ODNsLS45MzItNi40NzlsLS4wMSA2LjQ3OUg3LjI1NXYtOS44MTNoMy4yODZjLjExNS42OTMuMjE0IDEuMzk2LjMwNyAyLjA5OWwuMzU5IDIuNDlsLjU5NC00LjU4OWgzLjMwN3ptNi42MzYtMi45MDZjMCAuODctLjA1NyAxLjQ1OC0uMTQxIDEuNzZhMS4yNzMgMS4yNzMgMCAwIDEtLjQzMi42OTNhMS42MzIgMS42MzIgMCAwIDEtLjc2LjM1NGMtLjI5Ny4wNTctLjc2LjA5OS0xLjM1OS4wOTlsLS4wMDUtLjAwNWgtMy4wNzN2LTkuODEzaDEuOTAxYzEuMjE5IDAgMS45MzIuMDYzIDIuMzU5LjE2N2MuNDMyLjEyLjc2Ni4zMDIuOTk1LjU2M2MuMjE5LjI0LjM2NS41MzYuNDE3Ljg1OWMuMDY4LjMxMy4wOTkuOTM4LjA5OSAxLjg3em02LjU5NC42M2MwIC41OTktLjA2MyAxLjAyMS0uMTIgMS4zMjNjLS4wODMuMjk3LS4yNi41MzYtLjU0Mi43NTVjLS4zMDIuMjI0LS42NDEuMzIzLTEuMDQyLjMyM2MtLjI5MiAwLS42NjctLjA4My0uOTA2LS4xODJhMi4xOTIgMi4xOTIgMCAwIDEtLjY4OC0uNTczbC0uMTUxLjYzaC0yLjI5MnYtOS44MThsLS4wMjYtLjAwNWgyLjQwMXYzLjE5OGMuMTk4LS4yMzQuNDIyLS40MTEuNjc3LS41MzFhMi42MiAyLjYyIDAgMCAxIC45MjItLjE3MmMuMzAyIDAgLjU5OS4wNDcuODguMTU2Yy4yMjkuMDk0LjQyNy4yNDUuNTgzLjQzOGMuMTIuMTY3LjE5OC4zNTkuMjQuNTYzYy4wMzYuMTgyLjA1Ny41NzMuMDU3IDEuMTU2djIuNzR6bS0yLjkwMS0zLjYxOWMtLjE1NiAwLS4yNTUuMDU3LS4yOTcuMTYxYy0uMDQyLjEwOS0uMDc4LjM4NS0uMDc4LjgzM3YyLjU5NGMwIC40MzIuMDM2LjcxNC4wNzguODMzYS4zMTIuMzEyIDAgMCAwIC4zMDIuMTc3Yy4xNTYgMCAuMzU5LS4wNjMuNDAxLS4xODhjLjAzNi0uMTMuMDU3LS40MjcuMDU3LS44OTZsLjA0Mi0uMDA1di0yLjUyMWMwLS40MDEtLjAyMS0uNjc3LS4wNzgtLjgwMmMtLjA2My0uMTM1LS4yNi0uMTg4LS40MjItLjE4OHoiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJyZ2JhKDAsIDAsIDAsIDApIiAvPjwvc3ZnPg==`;

	let styles = `

	<style>
	.element__rating-button,
	.element__rating-div{
		display: block;
		position: absolute;
		bottom: 0;
		font-size: 12px;
		left: 50%;
		width: 100%;
		box-sizing: border-box;
		line-height: 25px;
		transform: translate(-50%, 0);
		background-color: ${props.brand};
		border: 0;
		color: #fff;
		outline: none;
		cursor: pointer;
		opacity: 0;
		transition: all ${props.transition};
		overflow: hidden;
	}
	.element__rating-div {
		opacity: 0.85;
		cursor: default;
		min-width: 100%;
		min-height: 25px;
		width: auto;
		/* border-radius: 4px 0 0 0; */
		transform: translate(0, 0);
		left: auto;
		right: 0;
		padding: 5px;
		box-sizing: border-box;
	}
	.element__rating-div .element__preloder {
		/* border-radius: 4px 0 0 0; */
	}
	.element__rating-button:hover {
		background-color: ${props._brand};
	}
	.element__wrapper {
		display: inline-block;
		position: relative;
		*zoom: 1
	}
	.element__wrapper a {
		position: relative;
		margin: 0 !important;
	}
	.element__wrapper:hover > .element__rating-button {
		opacity: 0.85;
		text-shadow: 1px 1px 2px #222222;
	}
	.element__wrapper::after {
		content: " "
		display: table
		clear: both
	}
	.element__preloader {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all ${props.transition};
	}
	.element__preloader svg {
		height: 25px;
		fill: ${props._brand};
		animation: linear 2s rotate infinite;
	}
	.element__preloader svg path {
		fill: ${props._brand};
	}
	.static {
		opacity: 0.85;
		text-shadow: 1px 1px 2px #222222;
		background-color: ${props.brand};
		line-height: 20px;
	}
	.static::before {
		content: url('data:image/svg+xml;base64, ${base64svg}');
		width: 28px;
		position: absolute;
		bottom: -5px;
		left: -5px;
		-webkit-filter: drop-shadow(0px 0px 5px #222222);
		filter: drop-shadow(0px 0px 5px #222222);
	}
	.static::after {
		content: url('data:image/svg+xml;base64, ${base64svg_imdb}');
		width: 28px;
		position: absolute;
		bottom: -7px;
		right: 2px;
		-webkit-filter: drop-shadow(0px 0px 5px #222222);
		filter: drop-shadow(0px 0px 5px #222222);
	}
	.static:hover {
		background-color: ${props.brand} !important;
	}
	.final__rating {
		display: block;
		text-align: center;
	}
	.tp1_a {
		display: block;
		float: left;
		position: relative;
	}
	.tp1_desc > .tp1_a {
		float: right;
	}
	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	</style>

	`;

	$('body').prepend(styles);
	$('.mn1_content > .bx1.stable a').each(function(){
		let th = $(this);
		return createWrapper(th);
	});
	function createWrapper(element) {
		element.wrap( "<div class='element__wrapper'></div>" );
		return createButton(element);
	}

	function createButton(element) {

		let button = document.createElement('button');
		button.className = 'element__rating-button';
		button.id = 'rating';
		button.innerHTML += props.buttonText;
		button.dataset.url = element[0]['href'];
		button.setAttribute('title', props.requestText);
		element.parent().append(button);
		button.addEventListener('click', function(button){
			if(!this.classList.contains('static')) {
				//отключаем кнопку
				button.srcElement.disabled = 1;
				let preloader = document.createElement('div');
				preloader.className = 'element__preloader';
				preloader.innerHTML += svg;
				element[0].innerHTML += preloader.outerHTML;
				var a = element;

				return requestPage(button, a);
			}
		})

	}

	function requestPage(element, a) {

		let url;
		if(element.srcElement !== undefined) {
			url = element.srcElement.dataset.url;
		} else {
			url = element[0].dataset.url;
		}

		let data = GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			headers: {
				'User-Agent': 'Mozilla/5.0',
				'Accept': 'text/xml'
			},
			onload: function (response) {

				if(response.status === 200) {

					//включаем кнопку
					if(element.srcElement !== undefined) {
						element.srcElement.disabled = 0;
					}

					//удаляем прелодер
					if(a[0] !== undefined) {
						a[0].children[1].remove();
					}

					requestPageResponse(element, a, response);
				}
			}
		});
	}

	function requestPageResponse(element, a, response) {
		let doc = response.responseText;
		let html = new DOMParser().parseFromString(doc, "text/html");

		let ul = html.querySelector(".men.w200");
		let items = ul.getElementsByTagName("li");
		let arr = [];
		for (var i = 1; i < items.length; ++i) {
			items[i].className += ' id-'+[i];

			let kpSearch = items[i].innerHTML.match(/Кинопоиск|IMDb/m);

			if(kpSearch) {
				arr.push(kpSearch);
			}
		}

		let imdb_rating, kp_rating;
		let kp_matches = arr.filter(value => /^Кинопоиск/.test(value));
		let imdb_matches = arr.filter(value => /^IMDb/.test(value));
		if(imdb_matches[0]) {
			imdb_rating = createRating(imdb_matches[0].input);
		} else {
			imdb_rating = 'n/a';
		}
		if(kp_matches[0]) {
			kp_rating = createRating(kp_matches[0].input);
		} else {
			kp_rating = 'n/a';
		}

		return createRatingRender(kp_rating, imdb_rating, element);
	}

	function createRating(str) {
		const regex = /(\*|\d+(\.\d+){0,2}(\.\*)?)(\<)/gm;
		let m;
		let arr = [];
		while ((m = regex.exec(str)) !== null) {
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}
			arr.push(m);
		}
		if(arr.length > 0 && arr[0][1]) {
			return arr[0][1]; //rating num (ex. 6.9)
		} else {
			return '—';
		}
	}

	function createRatingRender(kp_rating, imdb_rating, element) {
		let h = `
			<span class="final__rating"; span style="text-align:left;margin-left: 30px;">${kp_rating}<span style="float:right;margin-right: 35px;">${imdb_rating}</span>
			`;
		//для кнопки в топе
		if(element.srcElement !== undefined) {
			if(!element.srcElement.classList.contains('static')){
				element.srcElement.classList += ' static';
			}

			element.srcElement.innerHTML = h;
			element.srcElement.title = `Кинопоиск: ${kp_rating}, IMDb: ${imdb_rating}`;
		//для главной страницы (0-20)
		} else {
			if(!element.hasClass('static')) {
				element.addClass('static');
			}
			$(element).html(h);
		}
	}

	function createMainPageRatingsElement() {
		$('.tp1_body').each(function(){
			let img = $(this).find('.tp1_img');
			let a = img.parent();
			img.after(`<div class='element__rating-div'><div class='element__preloader'>${svg}</div></div>`);
			a.find('.element__rating-div').attr('data-url', a.attr('href'))
		});
	}
	createMainPageRatingsElement();

	function mainPageRatings() {
		//call func when user has an item in sight (https://github.com/imakewebthings/waypoints)
		$('.tp1_border > .tp1_body').each(function() {
			let self = $(this);
			let a = self.find('a');
			let element = a.find('.element__rating-div');
			a.addClass('tp1_a');
			const waypoint = new Waypoint({
				element: self[0],
				handler(direction) {
					const th = this;
					requestPage(element, a[0]);
					self.addClass('__init');
					th.destroy();
				}, offset: '80%'
			});
		});
	}
	mainPageRatings();

})();
