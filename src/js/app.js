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
        },
        login: {
            email: '',
            password: ''
        },
        signUp: {
            email: '',
            password: ''
        }
    },
    methods: {
        onEdit(key, value) {
            this.resume[key] = value
        },
        onLogin(e) {
            AV.User.logIn(this.login.email, this.login.password).then(function (loggedInUser) {
                console.log(loggedInUser);
            }, function (error) {
                if (error.code === 211) {
                    alert('邮箱不存在！')
                } else if (error.code === 210) {
                    alert('邮箱和密码不匹配！')
                }
            });
        },
        onLogout(e) {
            AV.User.logOut();
            alert('注销成功!')
            window.location.reload()
        },
        onSignUp(e) {
            // 新建 AVUser 对象实例
            const user = new AV.User();
            // 设置用户名
            user.setUsername(this.signUp.email);
            // 设置密码
            user.setPassword(this.signUp.password);
            // 设置邮箱
            user.setEmail(this.signUp.email);
            user.signUp().then(function (loggedInUser) {
                console.log(loggedInUser);
                alert('注册成功！')
                window.location.reload()
            }, function (error) {
            });
        },
        onClickSave(){
            let currentUser = AV.User.current()
            console.log(currentUser);
            if (!currentUser) {
                this.loginVisible = true
            } else {
                this.saveResume()
            }
        },
        saveResume() {
            let {id} = AV.User.current()
            // 第一个参数是 className，第二个参数是 objectId
            var user = AV.Object.createWithoutData('User', id);
            // 修改属性
            user.set('resume', this.resume);
            // 保存到云端
            user.save().then(()=>{
                alert('保存成功！')
            });
        }
    }
});