'use strict'

const Task = use('App/Models/Task')

// valida campo por campo
// const { validate } = use('Validator')

// validateAll - valida todos os campos de uma vez
const { validateAll } = use('Validator')

class TaskController {

  async index({ view }){

    const tasks = await Task.all()

    return view.render('tasks', {
      title: 'Latest tasks',
      tasks: tasks.toJSON()
    })
  }

  async store({ request, response, session }){

    // mensagem customizada de validação
    const message = {
      'title.required': 'Required',
      'title.min': 'min 3'
    }

    // regras de validação do form
    // https://indicative.adonisjs.com/guides/master/introduction
    const validation = await validateAll(request.all(), {
      title: 'required|min:5|max:140',
      body: 'required|min:10'
    }, message)

    // se validação falhar envie a falha e volte
    if(validation.fails()){
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const task = new Task()

    task.title = request.input('title')
    task.body = request.input('body')

    await task.save()

    // texto a ser enviado pra view de tasks pro usuario
    session.flash({ notification: 'Task added' })

    return response.redirect('/tasks')
  }

  async detail({ params, view }){
    const task = await Task.find(params.id)
    return view.render('detail', {
      task: task
    })
  }

  async remove({ params, response, session }){
    const task = await Task.find(params.id)
    await task.delete()
    session.flash({ notification: 'Task removed!' })

    return response.redirect('/tasks')
  }
}

module.exports = TaskController
