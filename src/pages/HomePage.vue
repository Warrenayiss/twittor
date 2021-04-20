<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            autogrow
            class="newTwoot"
            v-model="newTwootTxt"
            placeholder="What's happening?"
            counter
            maxlength="280"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img
                  src="https://image.noelshack.com/fichiers/2021/15/6/1618668645-img-20201207-090033-864.jpg"
                />
              </q-avatar>
            </template>
            <template v-slot:append>
              <q-icon
                v-if="newTwootTxt !== ''"
                name="close"
                @click="newTwootTxt = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewTwoot"
            push
            color="primary"
            label="Twoot"
            no-caps
            :disable="!newTwootTxt"
          />
        </div>
      </div>

      <q-separator size="18px" color="grey-2" class="divider" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated tada slower"
          leave-active-class="animated backOutDown"
        >
          <q-item class="q-py-md sep" v-for="twoot in Twoots" :key="twoot.id">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img
                  src="https://image.noelshack.com/fichiers/2021/15/6/1618668645-img-20201207-090033-864.jpg"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Warren Ayivor</strong>
                <span class="text-grey-7"
                  >@Warrenayiss <br class="lt-md" />
                  &bull; {{ twoot.date | relativeDate }}</span
                >
              </q-item-label>
              <q-item-label class="twoot-content text-body1"
                >{{ twoot.content }}
              </q-item-label>
              <div class="row justify-between q-mt-sm twoot-icons">
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="far fa-edit"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
                <q-btn
                  flat
                  @click="likeTwoot(twoot)"
                  round
                  :color="twoot.liked? 'pink' : 'grey'"
                  size="sm"
                  :icon="twoot.liked ? 'fas fa-heart' : 'far fa-heart' " />
                <q-btn
                  @click="deleteTwoot(twoot)"
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from '../boot/firebase'
import { formatDistance } from "date-fns";

export default {
  name: "HomePage",
  mounted() {
    db.collection("twoots").orderBy('date').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          let twootChange = change.doc.data()
          twootChange.id = change.doc.id
            if (change.type === "added") {
                console.log("New twoot: ", twootChange)
                this.Twoots.unshift(twootChange)
            }
            if (change.type === "modified") {
                console.log("Modified twoot: ", twootChange)
                let index = this.Twoots.findIndex(twoot => twoot.id === twootChange.id )
                Object.assign(this.Twoots[index], twootChange)
            }
            if (change.type === "removed") {
                console.log("Removed twoot: ", twootChange)
                let index = this.Twoots.findIndex(twoot => twoot.id === twootChange.id )
                this.Twoots.splice(index, 1)
            }
        })
    })
  },
  data() {
    return {
      newTwootTxt: "",
      Twoots: [
        // {
        //   id: "ID1",
        //   content: "lorem ipsmud",
        //   date: 1611653238221,
        //   liked: false
        // },
        // {
        //   id: "ID2",
        //   content: "lorem ipsmud then dea dedkqjdl af",
        //   date: 1611653238221,
        //   liked: true
        // }
      ]
    };
  },
  filters: {
    relativeDate: function(value) {
      return formatDistance(value, new Date());
    }
  },
  methods: {
    addNewTwoot() {
      let newTwoot = {
        content: this.newTwootTxt,
        date: Date.now(),
        liked: false
      };
      //this.Twoots.unshift(newTwoot);
      db.collection("twoots").add(newTwoot).then((docRef) => {
          console.log("Twoot written with ID: ", docRef.id);
      }).catch((error) => {
          console.error("Error adding twoot: ", error);
      })
      this.newTwootTxt = "";
    },
    deleteTwoot(twoot) {
      db.collection("twoots").doc(twoot.id).delete().then(() => {
          console.log("Twoot successfully deleted!");
      }).catch((error) => {
          console.error("Error removing twoot: ", error);
      })
    },
    likeTwoot(twoot){
      db.collection("twoots").doc(twoot.id).update({
          liked: !twoot.liked
      })
      .then(() => {
          console.log("Document successfully updated!");
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      })
    }
  }
};
</script>

<style lang="scss">
.newTwoot {
  textarea {
    font-size: 19px;
    line-height: 1.4 !important;
  }
}
.divider {
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: $grey-4;
}
.twoot-content {
  white-space: pre-line;
}
.twoot-icons {
  margin-left: -5px;
}

.sep:not(:first-child) {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
