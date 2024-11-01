import { GithubUser } from "./githubUser.js"

export class Favorites {
  constructor (root) {
    this.root = document.querySelector (root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem
      ('@github-favorites:') || [])
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExits = this.entries.find(entry => entry.login === username)

      if(userExits) {
        throw new Error('Este dev já faz parte de sua lista de favoritos')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('#add button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('#add input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
    
      row.querySelector('.user img').src = `https://avatars.githubusercontent.com/${user.login}`
      row.querySelector('.user img').alt = `Imágem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('button').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esse usuário')

        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    }) 

  }

  createRow () {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/RobertoLuiz-dev.png" alt="imagem do contato">
        <a target="_blank" href="https://github.com/RobertoLuiz-dev">
          <p>Roberto Luiz</p>
          <span>/RobertoLuiz-dev</span>
        </a>
      </td>
      <td class="repositories">17</td>
      <td class="followers">1</td>
      <td><button>Remover</button></td>
    `

    return tr
  }

  removeAllTr () {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()})
  }
}