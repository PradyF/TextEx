document.addEventListener('DOMContentLoaded', function () {
    loadJson();
});

function loadJson() {
    $.getJSON('flights.json', function (jsson) {
        let data = jsson.result.flights;
        const filters = document.querySelector('#filters');
        filters.addEventListener('input', filtersAll);
        let more = document.querySelector('#more');
        let less = document.querySelector('#less');
        let distation = document.querySelector('#distation');

        function filtersAll() {
            const priceMin = +document.querySelector('#price-min').value;
            const priceMax = +document.querySelector('#price-max').value;
            const transfer = [...filters.querySelectorAll('#airs input:checked')].map(n => n.value);

            outputData(data.filter(n => (
                (!transfer.length || transfer.length === n.flight.legs[0].segments.length) &&
                (!priceMin || priceMin <= n.flight.price.total.amount) &&
                (!priceMax || priceMax >= n.flight.price.total.amount)
            )));
        }

        function outputData(filt) {

            if (more.checked) {
                filt.sort((a, b) => a.flight.price.total.amount > b.flight.price.total.amount ? 1 : -1);
            }
            else if (less.checked) {
                filt.sort((a, b) => a.flight.price.total.amount < b.flight.price.total.amount ? 1 : -1);
            }
            else if (distation.checked) {
                filt.sort((a, b) =>
                    (a.flight.legs[0].segments[0].travelDuration + a.flight.legs[0].segments[a.flight.legs[0].segments.length - 1].travelDuration) > (b.flight.legs[0].segments[0].travelDuration + b.flight.legs[0].segments[b.flight.legs[0].segments.length - 1].travelDuration) ? 1 : -1);
            }
            document.getElementById('out').innerHTML = filt.map(n =>
                `
                <div class="cards">
                <div class="cart-cost">
                <div><img src="img/${n.flight.carrier.uid}.png" class="img-logo"></div>
                <div class="costs-texts">
                <div class="costs">${n.flight.price.total.amount}  &#8381;</div>
                <div>Стоимость для одного взрослого пассажира</div>
                </div>
                </div>
                <div class="direction">${n.flight.legs[0].segments[0].departureCity.caption}, ${n.flight.legs[0].segments[0].departureAirport.caption}  (${n.flight.legs[0].segments[0].departureAirport.uid}) &#8594; ${n.flight.legs[0].segments[n.flight.legs[0].segments.length - 1].arrivalCity.caption}, ${n.flight.legs[0].segments[n.flight.legs[0].segments.length - 1].arrivalAirport.caption} (${n.flight.legs[0].segments[n.flight.legs[0].segments.length - 1].arrivalAirport.uid})</div>
                <hr>
                <div class="times">
                <div>${n.flight.legs[0].segments[0].departureDate}</div> <div>${n.flight.legs[0].segments[n.flight.legs[0].segments.length - 1].arrivalDate}</div>
                </div>
                 <div class="company">Рейс выполняет: ${n.flight.carrier.caption}</div>
                 <div class="choose-button">Выбрать</div>
                  </div>`
            ).join('');
        }

        outputData(data);
    })
}
