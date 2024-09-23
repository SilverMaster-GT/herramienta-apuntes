<template>
  <el-row>
    <el-col :span="3"></el-col>
    <el-col :span="18">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          <el-image style="width: 200px; height: 75px" :src="url" fit="cover"/>
        </el-menu-item>
        <div class="flex-grow" />
        <el-sub-menu index="1" v-if="userLoggedIn.email">
          <template #title>
            <h4>Bienvenido, {{ userLoggedIn.email }} <el-icon><Avatar /></el-icon></h4>
          </template>
          <el-menu-item @click="logout" index="1-1">
            Cerrar sesión
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
      <h1 class="title">Herramienta de Apuntes</h1>

      <h2 class="subtitle">Apuntes guardados:</h2>
      <el-row>
        <el-table :data="filterTableData" height="300" style="width: 100%;">
          <el-table-column fixed="left" prop="tipo" label="Tipo" width="120"
            :filters="[
              { text: 'Importante', value: 'Importante' },
              { text: 'Trabajo', value: 'Trabajo' },
              { text: 'Recordatorio', value: 'Recordatorio' },
            ]"
            :filter-method="filterTag"
          >
            <template #default="apunte">
              <b
                :style="apunte.row.tipo === 'Importante' ? 'color: red' : (apunte.row.tipo === 'Trabajo' ? 'color: blue' : 'color: black')"
              >
                {{ apunte.row.tipo }}
              </b>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template #default="props">
              <div m="4">
                <pre m="t-0 b-2">{{ props.row.contenido }}</pre>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Apunte">
            <template #default="apunte">
              {{ apunte.row.contenido.length > 65 ? apunte.row.contenido.slice(0, 60) + '...' : apunte.row.contenido }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="200">
            <template #header>
              <el-input v-model="search" size="small" placeholder="Buscar...." />
            </template>
            <template #default="apunte">
              <el-button size="small" @click="editarApunte(apunte.row)" :icon="Edit" id="edit"
                >Editar</el-button>
              <el-button type="danger" size="small" @click="deleteAll(apunte.row.id, apunte.row.indice)" :icon="Delete" id="delete" >Eliminar</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <hr>

      <el-button type="success" @click="exportarCSV" :icon="Download" id="export">Exportar a CSV</el-button>

      <hr>

      <h2 class="subtitle">Agregar un nuevo apunte:</h2>

      <div class="form-group">
        <el-select v-model="nuevoApunte.tipo" class="m-2" placeholder="Elije un tipo de apunte" size="large" id="tiposApuntes" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="form-group">
        <label for="contenido">Contenido:</label>
        <el-input
          v-model="nuevoApunte.contenido"
          type="textarea"
          rows="10"
          :autosize="{ minRows: 10, maxRows: 10 }"
          id="textoApunte"
        />
      </div>

      <el-button type="primary" @click="modoEdicion ? guardarEdicion() : guardarApunte()" :icon="modoEdicion ? SuccessFilled : Finished" :id="modoEdicion ? 'guardarNuevo' : 'guardarEditado'" >
        {{ modoEdicion ? 'Guardar edición ' : 'Guardar apunte ' }}
      </el-button>
      <el-button v-if="modoEdicion" :icon="CircleCloseFilled" id="cancelarEdicion" >
        Cancelar Edición
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
import { collection, doc, addDoc, getDocs, query, deleteDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from '@/firebase'
import router from '@/router'
import { Delete, Edit, SuccessFilled, Finished, CircleCloseFilled, Download, Avatar } from '@element-plus/icons-vue'
import { h } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  data () {
    return {
      apuntes: [],
      nuevoApunte: {
        id: null,
        tipo: null,
        contenido: null
      },
      modoEdicion: false,
      userLoggedIn: {},
      url: require('@/assets/logo1.gif'),
      search: '',
      filterTableData: [],
      options: [
        {
          value: 'Importante',
          label: 'Importante'
        },
        {
          value: 'Trabajo',
          label: 'Trabajo'
        },
        {
          value: 'Recordatorio',
          label: 'Recordatorio'
        }
      ],
      Delete,
      Edit,
      Finished,
      CircleCloseFilled,
      SuccessFilled,
      Download,
      Avatar
    }
  },

  mounted () {
    onAuthStateChanged(this.$Auth, async (loggedInUser) => {
      if (loggedInUser) {
        this.userLoggedIn = loggedInUser
        await this.obtenerColeccion(loggedInUser)
      } else {
        router.push('/')
      }
    })
  },

  computed: {
    filteredData () {
      return this.apuntes.filter(data => !this.search || data.contenido.toLowerCase().includes(this.search.toLowerCase()))
    }
  },

  watch: {
    filteredData: {
      handler (data) {
        this.filterTableData = data
      },
      immediate: true
    }
  },

  methods: {
    filterTag (value, row) {
      return row.tipo === value
    },

    guardarApunte () {
      if (this.nuevoApunte.contenido !== '') {
        this.nuevoApunte.id = Date.now()
        this.apuntes.push({ ...this.nuevoApunte })

        this.guardarApuntesEnLocalStorage()

        const apuntesCollection = collection(doc(this.$firestore, 'usuarios', this.userLoggedIn.uid), 'apuntes')

        addDoc(apuntesCollection, this.nuevoApunte)
          .then((docRef) => {
            ElMessage({
              message: h('p', null, [
                h('i', { style: 'color: teal' }, 'Apunte '),
                h('span', null, 'Guardado con exito')
              ])
            })
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

    // guardarEdicion () {
    //   const index = this.apuntes.findIndex((apunte, currentIndex, array) => {
    //     if (currentIndex < array.length - 1) {
    //       return apunte.indice === array[currentIndex + 1].indice
    //     }
    //     return false
    //   })
    //   if (index !== -1) {
    //     this.apuntes.splice(index, 1, { ...this.nuevoApunte })
    //     this.nuevoApunte = { id: null, tipo: 'Personal', contenido: '' }
    //     this.modoEdicion = false

    //     this.guardarApuntesEnLocalStorage()
    //   }
    // },

    guardarEdicion () {
      const apunteRef = doc(this.$firestore, 'usuarios', this.userLoggedIn?.uid, 'apuntes', this.nuevoApunte.indice)

      const updatedData = {
        contenido: this.nuevoApunte.contenido,
        tipo: this.nuevoApunte.tipo
      }

      updateDoc(apunteRef, updatedData)
        .then(() => {
          const index = this.apuntes.findIndex((apunte) => apunte.indice === this.nuevoApunte.indice)

          if (index !== -1) {
            this.apuntes.splice(index, 1, { ...this.nuevoApunte })
            this.nuevoApunte = { id: null, tipo: 'Personal', contenido: '' }
            this.modoEdicion = false

            this.guardarApuntesEnLocalStorage()
          }
        })
        .catch((error) => {
          console.error('Error al guardar la edición del apunte:', error)
        })
    },

    obtenerColeccion: async function (info) {
      const q = query(collection(this.$firestore, 'usuarios', info?.uid, 'apuntes'))
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((doc) => {
        const apunte = {
          id: doc.data().id,
          contenido: doc.data().contenido,
          tipo: doc.data().tipo,
          indice: doc.id
        }

        this.apuntes.push(apunte)
      })
    },

    borrarApunte: async function (idDocumento) {
      const apuntesCollection = collection(doc(this.$firestore, 'usuarios', this.userLoggedIn?.uid), 'apuntes')
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
    },

    async logout () {
      await this.$Auth.signOut()
      await router.push('/')
    }
  }
}
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
.apuntes-locales {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 20px;
  margin-bottom: 10px;
}

.apuntes-table {
  margin: 20px auto;
  width: 100%;
  border-collapse: collapse;
}

.apuntes-table th,
.apuntes-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.apuntes-table th {
  font-weight: bold;
  text-align: left;
}

.apuntes-table td.tipo-important {
  text-align: right;
  color: red;
  font-weight: 700;
  text-decoration: underline;
}

.apuntes-table td.tipo-normal {
  text-align: right;
  font-weight: 700;
  text-decoration: underline;
}

.apuntes-table td.apunte {
  text-align: left;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-guardar {
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-guardar:hover {
  background-color: #45a049;
}

.btn-exportar {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-exportar:hover {
  background-color: #0069d9;
}

.btn-editar,
.btn-eliminar {
  padding: 5px 10px;
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.btn-editar:hover,
.btn-eliminar:hover {
  background-color: #e9ecef;
}

.navbar {
  background-color: #f8f8f8;
  border-bottom: 1px solid #ccc;
  padding: 10px;
}

.navbar-brand img {
  max-height: 30px;
}

.navbar-menu {
  display: flex;
  justify-content: flex-end;
}

.navbar-item {
  margin-left: 10px;
}

.navbar-text {
  margin-right: 10px;
}

.navbar-button {
  padding: 10px 20px;
  background-color: #42b983;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
}

.navbar-button:hover {
  background-color: #23876e;
}

.navbar-button:active {
  background-color: #196347;
}

.logo > img {
  width: 200px;
  height: 400px;
  object-fit: cover;
}
</style>
