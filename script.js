  const Products = {

  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson 
   */
  displayProducts: productsJson => {
    // Render the products here
    const data = productsJson.data.products.edges;
    const mainContainer = document.getElementById("myData");
    for (var i = 0; i < data.length; i++) {
      // Create a card element to attach all child elements too
      let div = document.createElement("div");
      div.classList.add("card");

      // Create a image element and add the source attribute then append the image to the card div
      let image = document.createElement("img");
      image.src = data[i].node.images.edges[0].node.originalSrc;
      image.classList.add("card__image");
      div.appendChild(image);
      
      // Create a h4 element and add the title text then append the title to the card div
      let title = document.createElement("h4");
      title.innerText = data[i].node.title;
      image.classList.add("card__title");
      div.appendChild(title);

      // Create a p element and add the price text then append the title to the card div
      let price = document.createElement("p");
      let priceInfo = data[i].node.priceRange.minVariantPrice;
      price.innerText = `${priceInfo.currencyCode === 'GBP' ? '£' : '$'}${priceInfo.amount}`;
      div.appendChild(price);

      // Create a two div elements and the tags text to the inner one then append the tags to the card div
      let cardTags = document.createElement("div");
      cardTags.classList.add("card__tags");
      let tags = document.createElement("div");
      tags.classList.add("tag");
      tags.innerText = `#${data[i].node.tags}`;
      cardTags.appendChild(tags);
      div.appendChild(cardTags);

      // Append the card div to the main html container
      mainContainer.appendChild(div);
    }
  },

  state: {
    storeUrl: "https://api-demo-store.myshopify.com/api/2020-07/graphql",
    contentType: "application/json",
    accept: "application/json",
    accessToken: "b8385e410d5a37c05eead6c96e30ccb8"
  },

  /**
   * Sets up the query string for the GraphQL request
   * @returns {String} A GraphQL query string
   */
  query: () => `
    {
      products(first:3) {
        edges {
          node {
            id
            handle
            title
            tags
            images(first:1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `,

  /**
   * Fetches the products via GraphQL then runs the display function
   */
  handleFetch: async () => {
    const productsResponse = await fetch(Products.state.storeUrl, {
      method: "POST",
      headers: {
        "Content-Type": Products.state.contentType,
        "Accept": Products.state.accept,
        "X-Shopify-Storefront-Access-Token": Products.state.accessToken
      }, 
      body: JSON.stringify({
        query: Products.query()
      })
    });
    const productsResponseJson = await productsResponse.json();
    Products.displayProducts(productsResponseJson);
  },

  /**
   * Sets up the click handler for the fetch button
   */
  initialize: () => {
    // Add click handler to fetch button
    const fetchButton = document.querySelector(".fetchButton");
    if (fetchButton) {
      fetchButton.addEventListener("click", Products.handleFetch);
    }
  }

};

document.addEventListener('DOMContentLoaded', () => {
  Products.initialize();
});