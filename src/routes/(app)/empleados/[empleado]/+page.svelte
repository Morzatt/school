<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let { empleado } = $derived(data)
</script>

{empleado.primer_nombre} {empleado.primer_apellido}