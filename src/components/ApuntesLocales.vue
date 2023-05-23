<template>
  <div>
    <h1>Herramienta de Apuntes</h1>

    <h2>Apuntes guardados:</h2>

    <table>
      <thead>
          <tr>
            <th>Tipo</th>
            <th>Apunte</th>
            <th colspan="2">Acciones</th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="apunte in apuntes" :key="apunte.id">
            <td :class="apunte.tipo==='Importante' ? 'Importante' : 'tipo'">{{ apunte.tipo }}</td>
            <td class="apunte">{{ apunte.contenido }}</td>
            <!-- <td class="delete"><button @click="editarApunte(apunte)">Editar</button></td> -->
            <td class="delete"><button @click="deleteAll(apunte.id, apunte.indice)">Eliminar</button></td>
          </tr>
      </tbody>
    </table>
    <hr>
    <button @click="exportarCSV">Exportar a CSV</button>
    <hr>
    <h2>Agregar un nuevo apunte:</h2>
    <div>
      <label for="tipo">Tipo de apunte:</label>
      <select v-model="nuevoApunte.tipo" id="tipo">
        <option value="Importante">Importante</option>
        <option value="Trabajo">Trabajo</option>
        <option value="Recordatorio">Recordatorio</option>
      </select>
    </div>
    <br>
    <div>
      <label for="contenido">Contenido:</label><br>
      <textarea type="text" cols="50" rows="10" v-model="nuevoApunte.contenido" id="contenido" required/>
    </div>
    <button @click="modoEdicion ? guardarEdicion() : guardarApunte()">
      {{ modoEdicion ? 'Guardar edición' : 'Guardar apunte' }}
    </button>
  </div>
</template>

<script>
import { auth, firestore } from '@/firebase'
import router from '@/router'
import { collection, doc, addDoc, getDocs, query, deleteDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
export default {
  data () {
    return {
      apuntes: [],
      nuevoApunte: {
        id: null,
        tipo: 'Personal',
        contenido: ''
      },
      modoEdicion: false,
      userLoggedIn: null
    }
  },
  created () {
    if (!this.$user) {
      router.push('/')
    }
  },
  mounted () {
    // Observa el estado de autenticación
    onAuthStateChanged(auth, (loggedInUser) => {
      this.userLoggedIn = loggedInUser
      this.obtenerColeccion(loggedInUser)
    })
  },
  methods: {
    guardarApunte () {
      if (this.nuevoApunte.contenido !== '') {
        this.nuevoApunte.id = Date.now()
        this.apuntes.push({ ...this.nuevoApunte })

        this.guardarApuntesEnLocalStorage()
        // Agregar el nuevo apunte asociado al usuario en Firestore
        const apuntesCollection = collection(doc(firestore, 'usuarios', this.userLoggedIn.uid), 'apuntes')

        addDoc(apuntesCollection, this.nuevoApunte)
          .then((docRef) => {
            alert('Apunte guardado con ID: ' + docRef.id)
          })
          .catch((error) => {
            console.log('Error al guardar el apunte:', error)
          })

        this.nuevoApunte.contenido = ''
      }
    },
    eliminarApunte (id) {
      this.apuntes = this.apuntes.filter((apunte) => apunte.id !== id)
    },
    guardarApuntesEnLocalStorage () {
      localStorage.setItem('apuntes', JSON.stringify(this.apuntes))
    },
    exportarCSV () {
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'Tipo,Contenido\n'

      this.apuntes.forEach((apunte) => {
        const { tipo, contenido } = apunte
        const row = `${tipo},"${contenido}"\n`
        csvContent += row
      })

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'apuntes.csv')
      document.body.appendChild(link) // Required for Firefox
      link.click()
    },
    editarApunte (apunte) {
      this.nuevoApunte = { ...apunte }
      this.modoEdicion = true
    },
    guardarEdicion () {
      const index = this.apuntes.findIndex((apunte) => apunte.id === this.nuevoApunte.id)
      if (index !== -1) {
        this.apuntes.splice(index, 1, { ...this.nuevoApunte })
        this.nuevoApunte = { id: null, tipo: 'Personal', contenido: '' }
        this.modoEdicion = false

        this.guardarApuntesEnLocalStorage()
      }
    },
    // Leer una colección completa
    obtenerColeccion: async function (info) {
      const q = query(collection(firestore, 'usuarios', info.uid, 'apuntes'))
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((doc) => {
        const apunte = { id: doc.data().id, contenido: doc.data().contenido, tipo: doc.data().tipo, indice: doc.id }

        this.apuntes.push(apunte)
      })
    },
    borrarApunte: async function (idDocumento) {
      const apuntesCollection = collection(doc(firestore, 'usuarios', this.userLoggedIn.uid), 'apuntes')
      try {
        await deleteDoc(doc(apuntesCollection, idDocumento))
        console.log('Apunte borrado correctamente.')
      } catch (error) {
        console.error('Error al borrar el apunte:', error)
      }
    },
    deleteAll (id, apunteCloudId) {
      this.eliminarApunte(id)
      this.borrarApunte(apunteCloudId)
    }
  }
}
</script>

<style>
table {
  margin-left: auto;
  margin-right: auto;
}

table td.tipo {
  text-align: right;
  padding-right: 20px;
  font-weight: 700;
  text-decoration: underline;
}

table td.Importante {
  text-align: right;
  color: red;
  padding-right: 20px;
  font-weight: 700;
  text-decoration: underline;
}

table td.apunte {
  text-align: left;
}

.delete {
  padding-left: 10px;
  padding-right: 10px;
}
</style>