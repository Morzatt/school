<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let {alumno} = $derived(data)
</script>

<main>
    <p>{alumno.primer_nombre} {alumno.primer_apellido}</p>    
</main>