export async function getFormData<T extends Record<string, any>>(
    c: T,
    request: Request,
    mock: { formData: T } | undefined | null,
    data?: FormData
) {
    if (!mock) {
        if (data) {
            for (let i in c) { c[i] = data.get(`${i}`)?.toString()! }
        } else {
            let data = await request.formData()
            for (let i in c) { c[i] = data.get(`${i}`)?.toString()! }
        }

        return
    } 

    for (let i in c) { c[i] = mock.formData[i] }
    return
}