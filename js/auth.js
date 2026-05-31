async function checkAuth() {
    const {
        data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = "/login.html";
        return;
    }

    return session;
}