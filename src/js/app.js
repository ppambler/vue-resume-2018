let app = new Vue({
    el: '#app',
    data: {
        editingName: false,
        loginVisible: false,
        signUpVisible: false,
        resume: {
            name: '姓名',
            gender: '女',
            birthday: '1990年1月',
            jobTitle: '前端工程师',
            phone: '138111111111',
            email: 'example@example.com'
        }
    },
    methods: {
        onEdit(key, value) {
            this.resume[key] = value
        },
        onClickSave(){
            let currentUser = AV.User.current()
            if (!currentUser) {
                this.loginVisible = true
            } else {
                this.saveResume()
            }
        },
        saveResume() {

        }
    }
});