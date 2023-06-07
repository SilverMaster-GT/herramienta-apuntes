<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        :ellipsis="false"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item index="1">Apuntes Rapidos</el-menu-item>
        <el-menu-item index="2">Mas Sobre apuntes</el-menu-item>
        <el-menu-item index="3">Mas Herramientas</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="4">Iniciar Sesión</el-menu-item>
      </el-menu>
    </el-header>
    <el-main class='intro' :style="`background-image: url('${image}');`">
      <div class='introDescription' data-aos="zoom-in"
      data-aos-duration="1500"
      data-aos-delay='500' >
          Apuntes Rapidos
          <br>
          <p>  Tus apuntes donde los necesites </p>
      </div>
        <img  class='introImage' src='https://res.cloudinary.com/dsderm9xw/image/upload/v1622028117/3D%20Illustrations/3d-illustration4_usckww.png' alt='3d illustration of boy with a flag'/>

    </el-main>

    <el-main class='guide1' id="Quienes" :style="`background-image: url('${image2}');`">
      <img class='guide1Image' src='https://res.cloudinary.com/dsderm9xw/image/upload/v1622028085/3D%20Illustrations/3d-illustration2_ykuua3.png'
      alt='3d illustration of boy sitting with legs crossed'
      data-aos="slide-down"
      data-aos-ease = 'ease'
      data-aos-duration="1500"
      data-aos-delay='500'/>
      <div class='guide1Description'
        data-aos="slide-up"
        data-aos-ease = 'ease'
        data-aos-duration="1500"
        data-aos-delay='1000'>
        <h1> La importancia de tomar <br> apuntes en las clases. </h1>
        <div class="ancho">
        Los avances de las nuevas tecnologías
        han hecho que se empiecen a emplear métodos
        nuevos e innovadores en la pedagogía de
        las asignaturas. No obstante, las explicaciones
        que dan los profesores en clase siguen siendo
        el eje en torno al cual gira la enseñanza.
        <br />
        <br />
        <p style="padding-left: 35%;">
        <el-button @click="continuar">
          Seguir Leendo
        </el-button>
        </p>
        </div>
      </div>
    </el-main>
    <el-main class='guide2' :style="`background-image: url('${image3}');`" id="Herramientas">
      <div class='guide2Description'
          data-aos="slide-down"
          data-aos-ease = 'ease'
          data-aos-duration="1500"
          data-aos-delay='1000'>
            <h1> MAS  <br> Herramientas. </h1>
          <div class="ancho">
            Contamos con mas herramientas, que puedes utilizar de forma gratuita y
            seguiremos creando mas, puedes darnos ideas de herramientas y con gusto
            estaremos poiendonos manos a la obra
            <br />
            <el-button type="primary" @click="moreTools">Ver mas Herramientas</el-button>
            <el-button type="success" @click="dialogFormVisible = !dialogFormVisible">Sugerir nueva Herramienta</el-button>
          </div>
      </div>
      <img class='guide2Image' src='https://res.cloudinary.com/dsderm9xw/image/upload/v1622028057/3D%20Illustrations/3d-illustration1_j06j0a.png'
        alt='3d illustration of boy with laptop sitting'
        data-aos="slide-up"
        data-aos-duration="1500"
        data-aos-ease = 'ease'
        data-aos-delay='1000'
      />
    </el-main>

    <el-footer>
      <el-row>
        <el-col :span="5">
          <el-statistic title="Daily active users" :value="50" />
        </el-col>
        <el-col :span="5">
          <el-statistic :value="35">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Ratio of men to women
                <el-icon style="margin-left: 4px" :size="12">
                  <Male />
                </el-icon>
              </div>
            </template>
            <template #suffix>/ 15</template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic title="Total Transactions" :value="400" />
        </el-col>
        <el-col :span="5">
          <el-statistic title="Feedback number" :value="countFeedback">
            <template #suffix>
              <el-icon style="vertical-align: -0.125em">
                <ChatLineRound @click="dialogFormVisible = !dialogFormVisible" id="icon"/>
              </el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="5">
          Developed by: Victor Lopez
        </el-col>
      </el-row>
    </el-footer>

    <el-dialog v-model="dialogFormVisible" title="Deja tu opinion sobre esta herramienta o sugiere una nueva">
      <el-form :model="form">
        <el-form-item label="Titulo" :label-width="formLabelWidth">
          <el-input v-model="form.titulo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Tu opinión o mensaje">
          <el-input v-model="form.mensaje" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="message">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style>
*{
  margin:0;
  padding:0;
}

.intro{
  display:flex;
  background: #fff3e2;
  justify-content: space-evenly;
  padding-top:80px;
  height: 575px;
}
.introDescription {
  font-size:30px;
  color:#632b2b;
  padding-top:120px;
}
.introDescription p{
  font-size: 60px;
  color: #ffffff;
  font-weight: 900;
  text-shadow: 2px 2px 3px black;
  font-variant: petite-caps;
}

.guide1{
  display:flex;
  background: #ffd4a9;
  justify-content: space-evenly;
  padding-top:80px;
  height: 639px;
  overflow:hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.guide1Description h1{
  font-size: 48px;
  color: #ffffff6e;
  padding: 120px 0px 20px 0px;
  text-shadow: 3px 3px 3px black;
}
.guide1Description div{
  background: #fff3e287;
  color: #000000;
  font-size: 20px;
  padding: 10px;
  border-radius: 10px;
  text-shadow: 1px 1px 3px white;
  font-variant: petite-caps;
  box-shadow: 0px 0px 3px 2px white;
}

.guide2{
  display:flex;
  background: #fff3e2;
  justify-content: space-evenly;
  padding-top:80px;
  height: 575px;
  overflow:hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.guide2Description h1{
  font-size:48px;
  color:#ffffff80;
  padding: 120px 0px 20px 0px;
  text-shadow: 1px 1px black;
}
.guide2Description div{
  background: #fff3e287;
  color: #000000;
  font-size:20px;
  padding:10px;
  border-radius:10px;
  text-shadow: 1px 1px 3px white;
  font-variant: petite-caps;
  box-shadow: 0px 0px 3px 2px white;
}

footer{
  background: #ffd4a9;
  color:#632b2b;
  padding: 8px !important;
  text-align: center;
  font-weight: 700;
  vertical-align: middle;
}

/* responsiveness */
@media screen and (max-width: 500px){

  .intro{
  display:block;
  padding-top:10px;
  height:auto;
}
.introImage{
  width:100%;
}
.introDescription {
  padding: 30px 0px 0px 20px;
}

 .guide1{
 display:block;
  padding-top:10px;
  height:auto;
}
.guide1Image{
  width:100%;
}
.guide1Description {
  padding: 20px;
}
.guide1Description h1{
  padding:30px 0px;
}

.guide2{
 display:block;
  padding-top:10px;
  height:auto;
}
.guide2Image{
  width:100%;
}
.guide2Description {
  padding: 20px;
}
.guide2Description h1{
  padding:30px 0px;
}

}
.flex-grow {
  flex-grow: 1;
}

.ancho {
  width: 439px;
  margin-left: auto;
  margin-right: auto;
  text-align: justify;
}

.el-main {
  padding: 0px !important;
}

#icon {
  cursor: pointer;
}
</style>

<script>
import { addDoc, collection, doc, getDocs, query } from 'firebase/firestore'
import { ElMessage } from 'element-plus'
import { h } from 'vue'
import router from '@/router'

export default {
  data () {
    return {
      image: require('@/assets/background.svg'),
      image2: require('@/assets/BackSeccion2.svg'),
      image3: require('@/assets/BackSeccion3.svg'),
      dialogFormVisible: false,
      form: {
        titulo: '',
        mensaje: ''
      },
      countFeedback: 0
    }
  },
  async mounted () {
    const q = query(collection(this.$firestore, 'feedback', 'FEadzIJVCSmA2GQ4W8S0', 'allUsers'))
    const querySnapshot = await getDocs(q)
    this.countFeedback = querySnapshot.size
  },
  methods: {
    handleSelect (key, keyPath) {
      const Seccion2 = document.getElementById('Quienes')
      const Seccion3 = document.getElementById('Herramientas')

      switch (key) {
        case '1':

          break
        case '2':
          Seccion2.scrollIntoView({ behavior: 'smooth' })
          break
        case '3':
          Seccion3.scrollIntoView({ behavior: 'smooth' })
          break
        case '4':
          router.push('/login')
          break

        default:
          break
      }
    },
    message () {
      const apuntesCollection = collection(doc(this.$firestore, 'feedback', 'FEadzIJVCSmA2GQ4W8S0'), 'allUsers')

      addDoc(apuntesCollection, this.form)
        .then((docRef) => {
          ElMessage({
            message: h('p', null, [
              h('i', { style: 'color: teal' }, 'Feedback '),
              h('span', null, 'Guardado con exito')
            ])
          })
          this.dialogFormVisible = false
        })
        .catch((error) => {
          console.log('Error al guardar el feedback:', error)
          this.dialogFormVisible = false
        })
    },
    moreTools () {
      ElMessage({
        message: h('p', null, [
          h('i', { style: 'color: red' }, 'Proximamente!!! '),
          h('span', null, 'Tenemos varias herramientas actualmente en fase Beta, dentro de poco podras probarlas')
        ])
      })
    },
    continuar () {
      const url = 'https://planlea.edu.do/2020/09/la-importancia-de-tomar-apuntes-en-las-clases/#:~:text=Es%20innegable%20que%20cuando%20estamos,memoria%20de%20una%20forma%20especial.'
      window.open(url, '_blank')
    }
  }
}
</script>
