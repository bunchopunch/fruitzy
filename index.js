Vue.component('fruitViewer', {
    data() {
      return {
        items: [],
        selected: '',
        filters: {
          search: null,
          size: null,
          color: null
        }
      }
    },
    computed: {
      selectedCard() {
        if (this.selected) {
          return this.items[this.selected-1]; 
        }
        return null;
      },
      filteredResults() {
        return this.items.filter((el) => {
          let color = true,
            size = true,
            search = true;
          if (this.filters.search) { 
            search = el.title.toLowerCase().includes(this.filters.search); }
          if (this.filters.color) { color = el.color.toLowerCase() == this.filters.color; }
          if (this.filters.size) { size = el.size.toLowerCase() == this.filters.size }
          return color && size && search;
        })
      }
    },
    methods: {
      fetchItems () {
        this.items = [
          {uid: 1, title: '🍎 Apple', desc: 'One a day', color: 'Red', size: 'Medium'},
          {uid: 2, title: '🍇 Grapes', desc: 'They\'re grrrraappe~!', color: 'Purple', size: 'Large'},
          {uid: 3, title: '🍌 Banana', desc: 'Spells D.O.L.E: Dole', color: 'Yellow', size: 'Medium'},
          {uid: 4, title: '🍊 Orange', desc: 'Orange you glad?', color: 'Orange', size: 'Medium'},
          {uid: 5, title: '🍑 Peach', desc: 'Ap-peach-iate them', color: 'Orange', size: 'Medium'},
          {uid: 6, title: '🍅 Tomato', desc: 'We swear', color: 'Red', size: 'Medium'},
          {uid: 7, title: '🔵 Blueberry', desc: 'Mmmm~ Blue', color: 'Blue', size: 'Small'},
          {uid: 8, title: '🍓 Starwberry', desc: 'Mmmm~ Straws', color: 'Red', size: 'Small'},
          {uid: 9, title: '🍕 Pizza', desc: 'Born in the U.S.A.', color: 'Yellow', size: 'Large'}
        ]
      },
      // Set the selection the the current uid.
      setSelection (id) {
        this.selected = id;
      },
      // Update the data of the currently selected item.
      changeSelectionData (field, data){
        // Pick the item with the matching uid stored in selected.
        this.items.filter((e, i, a) => {
          return e['uid'] == this.selected; 
        })[0][field] = data;
      },
      // Update one of the filters being applied to the list of items.
      filterItems (filter, value){
        this.filters[filter] = value;
      }
    },
    created() { 
      this.fetchItems();
      // this.$on('changeSelection', this.setSelection);
    },
    template: `
    <div class="grid" >
      <aside class="col">
        <card title="Find a Fruit">
          <item-find @filterItems="filterItems"></item-find>
        </card>
      </aside>
      <main class="col col--wide">
        <item-list :items="filteredResults" @setSelection="setSelection"></item-list>
      </main>
      <aside class="col">
        <card title="Editor">
          <item-edit :selectedCard="selectedCard" @updateSelected="changeSelectionData"></item-edit>
        </card>
      </aside>
    </div>`
  })
  
  Vue.component('card', {
    props: {
      title: String
    },
    data() {
      return {
        show: true
      }
    },
    template: `
      <section class="card card--fruity">
        <h2><span v-on:click="">{{title}} <input type="checkbox" value="hidden" v-model="show"></span></h2>
        <div v-if="show">
          <slot></slot>
        </div>
      </section>` 
  })
  
  Vue.component('itemFind', {
    methods: {
      emitFilter (filter, query) {
        this.$emit('filterItems', filter, query)
      }
    },
    template: `
    <section>
      <p>
        <label for="search">Search For:</label>
        <input id="search" name="search" placeholder="Orange, Banana, Car..." @keyup="emitFilter('search', $event.target.value)">
      </p>
      <h3>Filter By</h3>
      <p>
        <label for="color">Color:</label>
        <select @change="emitFilter('color', $event.target.value)">
          <option value="">All</option>
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
        </select>
      </p>
      <p>
        <label for="size">Size:</label>
        <select @change="emitFilter('size', $event.target.value)">
          <option value="">All</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </p>
    </section>`
  })
  
  Vue.component('itemList', {
    data() {
      return {
        selected: null
      }
    },
    props: [
      'items'
    ],
    watch: {
      selected: function () {
        this.$emit('setSelection', this.selected);
      }    
    },
    methods: {
      selectItem(id) {
        this.selected = id;
      },
      isSelected(id) {
        return this.selected == id;
      }
    },
    template: `
    <section class="card item-display">
      <h2>Listings</h2>
      <ul class="item-display__list">
        <li v-for="item in items" :key="item.uid" class="item-display__item">
          <article class="card" v-on:click="selectItem(item.uid)" :class="{ 'item-display__card--is-selected': isSelected(item.uid) }">
            <h3>{{item.title}}</h3>
            <p>{{item.desc}}</p>
            <small>Color: {{item.color}}, Size: {{item.size}}</small>
          </article>
        </li>
      </ul>
    </section>`
  })
  
  Vue.component('itemEdit', {
    props: {
      selectedCard: Object
    },
    methods: {
      updateField(field, data){
        console.log(field, data);
        this.$emit('updateSelected', field, data)
      }
    },
    template: `
      <div v-if="selectedCard">
        <input type="input" :value="selectedCard.title" @keyup="updateField('title', $event.target.value)"></input>
        <textarea cols="30" rows="3" :value="selectedCard.desc" @keyup="updateField('desc', $event.target.value)"></textarea>
        <input type="input" :value="selectedCard.color" @keyup="updateField('color', $event.target.value)"></input>
        <input type="input" :value="selectedCard.size" @keyup="updateField('size', $event.target.value)"></input>
        <input type="button" value="Delete"></button>
      </div>`
  })
  
  new Vue({
    el: "#app"
  })