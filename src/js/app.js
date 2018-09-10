let app = new Vue({
    el: '#app',
    data: {
        editingName: false,
        loginVisible: false,
        signUpVisible: false,
        shareVisible: false,
        previewUser: {
            objectId: undefined,
        },
        previewResume: {},
        currentUser: {
            objectId: undefined,
            email: '',
            fuck: 'fuck'
        },
        resume: {
            name: '姓名',
            gender: '女',
            birthday: '1990年1月',
            jobTitle: '前端工程师',
            phone: '138111111111',
            email: 'example@example.com',
            skills: [
                {name: '请填写技能名称', description: '请填写技能描述'},
                {name: '请填写技能名称', description: '请填写技能描述'},
                {name: '请填写技能名称', description: '请填写技能描述'},
                {name: '请填写技能名称', description: '请填写技能描述'}
            ],
            projects: [
                {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键词', description: '请详细描述'},
                {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键词', description: '请详细描述'},
            ]
        },
        login: {
            email: '',
            password: ''
        },
        signUp: {
            email: '',
            password: ''
        },
        shareLink: '不知道',
        mode: 'edit' //'preview'
    },
    computed: {
        displayResume () {
            return this.mode === 'preview' ? this.previewResume : this.resume
        }
    },
    watch: {
      'currentUser.objectId' : function (newValue, oldValue) {
          if(newValue) {
              this.getResume(this.currentUser)
          }
      }  
    },
    methods: {
        onEdit(key, value) {
            let regex = /\[(\d+)\]/g
            key = key.replace(regex,(match, number) => `.${number}`)
            //key = skills.0.name
            keys = key.split('.')
            let result = this.resume
            for (let i = 0; i < keys.length; i++) {
                if(i === keys.length - 1) {
                    result[keys[i]] = value
                } else {
                    result = result[keys[i]]
                }
            }
        },
        hasLogin() {
            return !!this.currentUser.objectId
        },
        onLogin(e) {
            AV.User.logIn(this.login.email, this.login.password).then((user) => {
                console.log(user);
                user = user.toJSON()
                this.currentUser.objectId = user.objectId
                this.currentUser.email = user.email
                this.loginVisible = false
                alert('登录成功！')
                window.location.reload()
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
            alert('登出成功!')
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
            user.signUp().then( (user) => {
                console.log(user);
                alert('注册成功！')
                user = user.toJSON()
                this.currentUser.objectId = user.objectId
                this.currentUser.email = user.email;
                this.signUpVisible = false
            }, function (error) {
                alert(error.rawMessage)
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
            let {objectId} = AV.User.current().toJSON()
            // 第一个参数是 className，第二个参数是 objectId
            var user = AV.Object.createWithoutData('User', objectId);
            // 修改属性
            user.set('resume', this.resume);
            console.log(this.resume)
            // 保存到云端
            user.save().then(()=>{
                alert('保存成功！')
            },() => {
                alert('保存失败！')
            });
        },
        getResume(user) {
            var query = new AV.Query('User');
            return query.get(user.objectId).then((user) => {
                // 成功获得实例
                // user 就是 id 为 57328ca079bc44005c2472d0 的 User 对象实例
                let resume = user.toJSON().resume
                return resume
            }, (error) => {
                // 异常处理
            });
        },
        addSkill() {
            this.resume.skills.push({
                name: '请填写技能名称',
                description: '请填写技能描述'
            })
        },
        removeSkill(index) {
            this.resume.skills.splice(index, 1)
        },
        addProject() {
            this.resume.projects.push(
                {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键词', description: '请详细描述'},
            )
        },
        removeProject(index) {
            this.resume.projects.splice(index, 1)
        }
    }
});

//获取当前用户
let currentUser = AV.User.current()
if(currentUser) {
    app.currentUser = currentUser.toJSON();
    app.shareLink = location.origin + location.pathname + '?user_id=' + app.currentUser.objectId
    app.getResume(app.currentUser).then(resume => {
        app.resume =resume
    })
}

//获取预览用户的id
let search = location.search
let regex = /user_id=([^&]+)/
let matches = search.match(regex)
let userId
if(matches) {
    userId = matches[1]
    app.mode = 'preview'
    app.getResume({objectId: userId}).then(resume => {
        app.previewResume = resume
    })
}