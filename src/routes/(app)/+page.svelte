<div class="flex flex-col items-center justify-start gap-4">
    <div class="flex items-center justify-start gap-4">
        <div class="flex w-52 flex-col gap-4">
            <div class="flex items-center gap-4">
                <div class="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div class="flex flex-col gap-4">
                <div class="skeleton h-4 w-20"></div>
                <div class="skeleton h-4 w-28"></div>
                </div>
            </div>
            <div class="skeleton h-32 w-full"></div>
        </div>
        <div class="flex items-center justify-start flex-wrap gap-3">
            {#each [1,2,3,4,5,6,7,8,9,10,11,12] as _}
                <div class="skeleton h-32 w-32"></div>           
            {/each}
        </div>
    </div>

    <div class="skeleton w-full h-32"></div>
</div>