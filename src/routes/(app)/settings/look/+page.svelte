<script>
    import { enhance } from "$app/forms";

  let colorMode = "system";
  let selectedTheme = "Royal Heath";
  let transparentSidebar = false;

  const theme = [
    "Claro", "Pastel", "Colmena", "Esmeralda",
    "Corporativo", "Futurista", "Retro", "Valentin",
    "Halloween", "Bosque", "Otoño", "Acido", 'Predeterminado'
  ];

  const themeColors = {
    'Predeterminado' : {color: 'gradient-box bg-gradient-to-r from-blue-100 via-cyan-200 to-sky-300', theme: 'winter'},
    'Claro': {color: 'gradient-box bg-gradient-to-r from-blue-200 via-sky-300 to-emerald-200', theme: 'light'}, // light, cupcake, bumblebee, emerald, corporate, synthwave, retro, valentine, halloween, autumn, acid

    'Pastel':           {color:'gradient-box bg-gradient-to-r from-pink-200 via-rose-100 to-yellow-100'   , theme: 'cupcake'},        // Cupcake
    'Colmena':          {color:'gradient-box bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400', theme: 'bumblebee'},      //Bumblebee
    'Esmeralda':        {color:'gradient-box bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400' , theme: 'emerald'},       // Emerald
    'Corporativo':      {color:'gradient-box bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800' , theme: 'corporate'},       // Corporate
    'Futurista':        {color:'gradient-box bg-gradient-to-r from-purple-800 via-fuchsia-700 to-cyan-500', theme: 'synthwave'},      // Synthwave
    'Retro':            {color:'gradient-box bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-700', theme: 'retro'},      // Retro
    'Valentin':         {color:'gradient-box bg-gradient-to-r from-red-400 via-pink-300 to-rose-200'      , theme: 'valentine'},            // Valentine
    'Halloween':        {color:'gradient-box bg-gradient-to-r from-orange-700 via-amber-800 to-black'     , theme: 'halloween'},           // Halloween
    'Bosque':           {color:'gradient-box bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700' , theme: 'forest'},       // Forest 
    'Otoño':            {color:'gradient-box bg-gradient-to-r from-orange-600 via-red-500 to-brown-700'   , theme: 'autumn'},         // Otono
    'Acido':            {color:'gradient-box bg-gradient-to-r from-lime-400 via-yellow-300 to-fuchsia-400', theme: 'acid'},    // Acid
  };


  let themes = theme.map(i => {
      return {
        name: i,
        color: themeColors[i].color,
        theme: themeColors[i].theme
      }
  })

</script>

<div class="w-full mx-auto mt-5 px-4 animate-y">
  <!-- Appearance Card -->
  <div class="card bg-base-100 rounded-2xl shadow-xl p-8 border border-base-200">
    <h2 class="card-title text-2xl font-bold mb-8">Apariencia y Estilos</h2>

    <!-- Color Mode
    <div class="mb-10">
      <div class="font-semibold mb-2">Color Mode</div>
      <div class="text-sm text-base-content/60 mb-4">Select your default theme</div>
      <div class="flex flex-wrap gap-8">
        <label class="cursor-pointer flex flex-col items-center group transition">
          <input type="radio" class="hidden" bind:group={colorMode} value="dark" />
          <div class="w-24 h-16 rounded-xl border-2 border-base-200 flex items-center justify-center mb-1
            transition-all duration-200 group-hover:border-primary
            {colorMode === 'dark' ? 'ring-2 ring-primary border-primary' : ''}">
            <div class="w-20 h-12 bg-gray-800 rounded-lg shadow-inner"></div>
          </div>
          <span class="text-xs mt-1 group-hover:text-primary transition">Dark</span>
        </label>
        <label class="cursor-pointer flex flex-col items-center group transition">
          <input type="radio" class="hidden" bind:group={colorMode} value="system" />
          <div class="w-24 h-16 rounded-xl border-2 border-base-200 flex items-center justify-center mb-1
            transition-all duration-200 group-hover:border-primary
            {colorMode === 'system' ? 'ring-2 ring-primary border-primary' : ''}">
            <div class="w-20 h-12 bg-gradient-to-r from-gray-800 via-white to-gray-800 rounded-lg shadow-inner"></div>
          </div>
          <span class="text-xs mt-1 text-primary font-semibold group-hover:underline transition">System Default</span>
        </label>
        <label class="cursor-pointer flex flex-col items-center group transition">
          <input type="radio" class="hidden" bind:group={colorMode} value="light" />
          <div class="w-24 h-16 rounded-xl border-2 border-base-200 flex items-center justify-center mb-1
            transition-all duration-200 group-hover:border-primary
            {colorMode === 'light' ? 'ring-2 ring-primary border-primary' : ''}">
            <div class="w-20 h-12 bg-white border border-base-200 rounded-lg shadow-inner"></div>
          </div>
          <span class="text-xs mt-1 group-hover:text-primary transition">Light</span>
        </label>
      </div>
    </div> -->

    <!-- Themes -->
    <div class="mb-10">
      <div class="font-semibold mb-2">Temas</div>
      <div class="text-sm text-base-content/60 mb-4">Escoja un tema para cambiar los colores, formas y tonalidades de la aplicación.</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {#each themes as theme}
          <form action="?/changeTheme" method="post" use:enhance={() => {
            selectedTheme = theme.name;
            let html = document.getElementsByTagName('html')[0].attributes.getNamedItem('data-theme').value = theme.theme
          }} class="flex items-center rounded-full border
              border-base-content
                
                {selectedTheme === theme.color ? 'ring-2 ring-primary border-primary bg-primary/10 font-semibold' : ''}">
            <input type="hidden" name="theme_name" value={theme.theme}>
            <button
              class="flex size-full px-4 py-2 items-center gap-2 rounded-full
              transition-all duration-150 shadow-sm hover:scale-95 hover:border-primary focus:ring-2 focus:ring-primary"
              type="submit">
              <span class={`w-6 h-6 rounded-full ${theme.color} border-2 border-white shadow`}></span>
              <span class="text-sm">{theme.name}</span>
            </button>
          </form>
        {/each}
      </div>
    </div>

    <!-- Transparent Sidebar -->
    <div>
      <div class="font-semibold mb-2">Transparent sidebar</div>
      <div class="text-sm text-base-content/60 mb-4">Make the desktop sidebar transparent</div>
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" class="toggle toggle-primary" bind:checked={transparentSidebar} />
        <span class="text-sm">Transparent sidebar sidebar</span>
      </label>
    </div>
  </div>
</div>