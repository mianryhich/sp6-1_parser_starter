// @todo: напишите здесь код парсера

function parsePage() {
    const priceDiv = document.querySelector('.price');
    const cleanText = priceDiv.textContent.replace(/₽/g, '').replace(/\s+/g, ' ').trim();
    const prices = cleanText.split(' ').map(p => parseFloat(p));

    const price = prices[0];
    const oldPrice = prices[1] || 0;
    const discount = oldPrice - price;
    const discountPercent = oldPrice ? `${((discount / oldPrice) * 100).toFixed(2)}%` : '0%';
    const firstChar = priceDiv.textContent.trim()[0];
    const currencyMap = {
        '₽': 'RUB',
        '$': 'USD', 
        '€': 'EUR'
    };
    return {
        meta: {
            "title": document.title.split("—")[0].trim(),
            "description": document.querySelector('meta[name="description"]').getAttribute('content'),
            "keywords": document.querySelector('meta[name="keywords"]').getAttribute('content').split(','),
            "language": document.querySelector('html').getAttribute('lang'),
            "opengraph": (() => {
                const og = {};
                document.querySelectorAll('meta[property^="og:"]').forEach(tag => {
                const key = tag.getAttribute('property').replace('og:', '');
                let value = tag.getAttribute('content')?.trim() || '';

                if (key === 'title') {
                     value = value.split('—')[0].trim();
                }
    
                if (value) og[key] = value;
            });
                return og;
            })()
        },
        product: {
            "id": document.querySelector('.product').dataset.id,
            "name": document.querySelector('h1').textContent,
            "isLiked": document.querySelector('button.like').classList.contains('active'),
            "tags": {
                "category": [document.querySelector('.green').textContent],
                "discount": [document.querySelector('.red').textContent],
                "label": [document.querySelector('.blue').textContent],
            },
            "price": price,
            "oldPrice": oldPrice,
            "discount": discount,
            "discountPercent": discountPercent,
            "currency": currencyMap[firstChar],
            "properties": (() => {
               const props = {};
               document.querySelectorAll('.properties li').forEach(li => {
                   const spans = li.querySelectorAll('span');
                   if (spans.length === 2) {
                       props[spans[0].textContent.trim()] = spans[1].textContent.trim();
                   }
               });
                return props;
            })(),
            "description": document.querySelector('.description').innerHTML
                .replace(/\s+class="[^"]*"/g, '')
                .replace(/^/gm, '                ')
                .replace(/^\s*\n/, ''),
            "imagea": (() => {
                const thumbs = document.querySelectorAll('.preview nav button img');
                const mainImg = document.querySelector('.preview figure img');

                return Array.from(thumbs).map((thumb, index) => ({
                    preview: thumb.src,
                    full: index === 0 ? mainImg.src : thumb.dataset.src,
                    alt: thumb.alt
                }));
            })(),
        },
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;