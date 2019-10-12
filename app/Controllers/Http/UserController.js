'use strict'

const User = use("App/Models/User")

class UserController {

  async store ({ request, response }) {
    const data = request.only(["username", "email", "password"])

    const user = await User.create(data)

    return response.redirect('/')
  }

  async login ({ auth, request, view }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    // return 'Logged in successfully'

    return view.render('profile', {
      email: email
    })
  }
}

module.exports = UserController
