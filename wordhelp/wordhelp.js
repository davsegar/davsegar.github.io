function toggle_darkmode()
{
	var bootstrap_css = document.getElementById('bootstrap_css');
	if (bootstrap_css)
	{
		if (bootstrap_css.href.includes('bootstrap.min.css'))
		{
			bootstrap_css.href = 'https://cdn.jsdelivr.net/npm/bootstrap-dark-5@1.1.3/dist/css/bootstrap-night.min.css';

			var btn_darkmode = document.getElementById('btn_darkmode');
			if (btn_darkmode) btn_darkmode.innerHTML = '&#127774;';
		}
		else
		{
			bootstrap_css.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';

			var btn_darkmode = document.getElementById('btn_darkmode');
			if (btn_darkmode) btn_darkmode.innerHTML = '&#127770;';
		}
	}
}

function calcular_probabilidades(dicc)
{
	var prob = {};
	var len = dicc.lenght;
	dicc.forEach(function (palabra) {
		var pos = 1;
		for (const letra of palabra) {
			if (! prob[pos]) prob[pos] = {};
			if (! prob[pos][letra]) prob[pos][letra] = 0;
			prob[pos][letra]++;
			pos++;
		}
	});
	return prob;
}

function calcular_puntos(palabra, prob)
{
	var puntos = 1;
	var pos = 1;
	for (const letra of palabra) {
		if (prob[pos])
		{
			if (prob[pos][letra])
			{
				puntos *= prob[pos][letra];
			}
		}
		pos++;
	}
	return puntos;
}

function calcular_puntos_diccionario(dicc)
{
	var dicc_puntos = {}
	var prob = calcular_probabilidades(dicc);
	dicc.forEach(function (palabra) {
		dicc_puntos[palabra] = calcular_puntos(palabra, prob);
	});
	return dicc_puntos;
}

function ordenar_diccionario(dicc)
{
	var dicc_puntos = calcular_puntos_diccionario(dicc);
	return dicc.sort(function (a, b) {
		var pa = dicc_puntos[a];
		var pb = dicc_puntos[b];
		return pb - pa;
	});
}

function diccionario_no_contiene_letra(dicc, letra)
{
	var new_dicc = [];
	dicc.forEach(function (palabra) {
		if (! palabra.includes(letra)) new_dicc.push(palabra);
	});
	return new_dicc;
}

function diccionario_contiene_letra(dicc, letra, n_veces)
{
	var new_dicc = [];
	dicc.forEach(function (palabra) {
		//if (palabra.includes(letra)) new_dicc.push(palabra);
		if (contar_letra_en_palabra(letra, palabra) == n_veces) new_dicc.push(palabra);
	});
	return new_dicc;
}

function contar_letra_en_palabra(letra, palabra)
{
	var n = 0;
	for (const c of palabra)
	{
		if (c == letra) n++;
	}
	return n;
}

function palabra_contiene_letra_posicion(palabra, letra, pos)
{
	var pos_aux = 1
	for (const letra_aux of palabra) {
		if (pos_aux == pos)
		{
			if (letra_aux == letra)
			{
				return true;
			}
			return false;
		}
		pos_aux++;
	}
	return false;
}

function diccionario_contiene_letra_posicion(dicc, letra, pos)
{
	var new_dicc = [];
	dicc.forEach(function (palabra) {
		if (palabra_contiene_letra_posicion(palabra, letra, pos))
		{
			new_dicc.push(palabra);
		}
	});
	return new_dicc;
}

function extraer_sugerencias(dicc, num)
{
	var sugerencias = [];
	var dicc_2 = dicc.slice(0, num*num);
	var shuffled_dicc = dicc_2.sort(function (a, b) {
		return 0.5 - Math.random();
	});
	var i = 0;
	while (i < num)
	{
		if (shuffled_dicc[i])
		{
			sugerencias.push(shuffled_dicc[i]);
		}
		i++;
	}
	return sugerencias;
}

function actualizar()
{
	var dicc = diccionario;

	var $input_contiene = document.getElementById('input_contiene');
	if ($input_contiene)
	{
		var contiene = $input_contiene.value.toLowerCase();
		if (contiene)
		{
			for (const letra of contiene) {
				var n_veces = contar_letra_en_palabra(letra, contiene);
				dicc = diccionario_contiene_letra(dicc, letra, n_veces);
			}
		}
	}

	var $input_no_contiene = document.getElementById('input_no_contiene');
	if ($input_no_contiene)
	{
		var no_contiene = $input_no_contiene.value.toLowerCase();
		if (no_contiene)
		{
			for (const letra of no_contiene) {
				dicc = diccionario_no_contiene_letra(dicc, letra);
			}
		}
	}

	[1, 2, 3, 4, 5].forEach(function(n) {
		$input_letra = document.getElementById('input_letra_' + n.toString());
		if ($input_letra)
		{
			var letra = $input_letra.value.toLowerCase();
			if (letra)
			{
				dicc = diccionario_contiene_letra_posicion(dicc, letra, n);
			}
		}
	});

	dicc = ordenar_diccionario(dicc);
	var sugerencias = extraer_sugerencias(dicc, 5);

	$input_sugerencias = document.getElementById('input_sugerencias');
	if ($input_sugerencias)
	{
		$input_sugerencias.value = sugerencias.join(' ').toUpperCase();
	}
}

document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll('input[data-actualizar]').forEach(function ($element) {
		$element.addEventListener('keyup', actualizar);
		$element.addEventListener('paste', actualizar);
		$element.addEventListener('click', actualizar);
		$element.addEventListener('change', actualizar);
	});
});