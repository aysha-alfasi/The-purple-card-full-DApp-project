import React, { useEffect, useState } from "react";
import { thepurplecard_backend } from "declarations/thepurplecard_backend";

import Card from "./components/Card";
import Modal from "./components/Modal";
import { Howl } from "howler";
import Swal from 'sweetalert2';
import "./App.css";

const btnSound = new Howl({
  src: ["/sounds/btn.mp3"],
});
const finishSound = new Howl({
  src: ["/sounds/finish.mp3"],
});
const addSound = new Howl({
  src: ["/sounds/add.mp3"],
});

 const errSound2 = new Howl({
    src: ["/sounds/err3.mp3"],
  });

  const errSound3 = new Howl({
    src: ["/sounds/err1.mp3"],
  });

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);


  const openAddModal = () => {
    btnSound.play();
    setIsEditMode(true);
    setIsViewMode(false);
    setCurrentCard(null);
    setModalVisible(true);
  };

  const openEditModal = (card) => {
    setIsEditMode(true);
    setIsViewMode(false);
    setCurrentCard(card);
    setModalVisible(true);
  };

  const openViewModal = (card) => {
    setIsViewMode(true);
    setIsEditMode(false);
    setCurrentCard(card);
    setModalVisible(true);
  };

  const saveCard = async (newCard) => {
    setLoading(true);
    if (currentCard) {
        Swal.fire({
            title: 'Updating your card',
            html: `
            <div class="circles">
              <div class="circle1"></div>
              <div class="circle2"></div>
              <div class="circle3"></div>
            </div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: {
              popup: 'loading-alert',
              title: 'loading-title',
            },
          });
        try {
            if (
                newCard.title.trim() === currentCard.title.trim() &&
                newCard.about.trim() === currentCard.about.trim() &&
                newCard.content.trim() === currentCard.content.trim()
              ) {
                errSound2.play();
                Swal.fire({
                  icon: 'info',
                  title: '<span class="fun">🤭</span>',
                  text: "You didn't modify anything!",
                  background: '#fdf3ff',
                  customClass: {
                    confirmButton: 'my-confirm-btn',
                    popup: 'small-alert',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-text',
                  }
                });
                return;
              }
      
            await thepurplecard_backend.updateCardById(
                currentCard.id, 
                newCard.title, 
                newCard.about, 
                newCard.content  
            );
            console.log("Card updated in Motoko ✅");

            const updatedCards = await thepurplecard_backend.readCards();
      setCards(updatedCards);
      setLoading(false);
      Swal.fire({
        title: 'Updated!',
        text: 'The card has been successfully updated.',
        icon: 'success',
       background: '#f3e5f5',
       customClass: {
         confirmButton: 'my-confirm-btn',
         popup: 'large-alert',
         title: 'swal-custom-title',
            htmlContainer: 'swal-custom-text',
       }
    });
} catch (error) {
    console.error("Failed to update card in Motoko ❌", error);
    errSound2.play();
    Swal.fire({
        title: '<span class="shaky-emoji">🥺</span>',
        text: "Hmm... something didn’t go as planned. Wanna give it another shot? 🌸", 
        confirmButtonText: 'ok',
        background: '#f3e5f5',
        customClass: {
        confirmButton: 'my-confirm-btn',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-text',
          popup: 'large-alert'
        }
    });
} finally {
    setLoading(false);
}
    } else {
      Swal.fire({
        title: 'Adding your card',
        html: `
        <div class="circles">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
        </div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: {
          popup: 'loading-alert',
          title: 'loading-title',
        },
      });
      try {
        await thepurplecard_backend.createCard(
          newCard.title,
          newCard.about,
          newCard.content
        );
        console.log("Card created in Motoko ✅");
        const updatedCards = await thepurplecard_backend.readCards();
setCards(updatedCards);
        Swal.close();
        addSound.play();
      } catch (error) {
        console.error("Failed to create card in Motoko ❌", error);
        errSound2.play();
        Swal.fire({
            title: '<span class="shaky-emoji">🥺</span>',
            text: "Hmm... something didn’t go as planned. Wanna give it another shot? 🌸", 
            confirmButtonText: 'ok',
            background: '#f3e5f5',
            customClass: {
            confirmButton: 'my-confirm-btn',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-text',
              popup: 'large-alert'
            }
        });
      } finally {
        setLoading(false);
      }

    }
    closeModal();
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const cardsArray = await thepurplecard_backend.readCards();
    setCards(cardsArray);
  }

  const deleteCard = (id) => {
    errSound3.play();
    Swal.fire({
      title: 'Are you sure?',
      text: "You will not be able to retrieve this card after deletion!",
      icon: 'warning',
      background: '#f3e5f5',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'my-confirm-btn',
        cancelButton: 'my-cancel-btn',
        popup: 'large-alert',
        title: 'swal-custom-title',
            htmlContainer: 'swal-custom-text',
      }
    }).then( async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
            title: 'Deleting your card',
            html: `
            <div class="circles">
              <div class="circle1"></div>
              <div class="circle2"></div>
              <div class="circle3"></div>
            </div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: {
              popup: 'loading-alert',
              title: 'loading-title',
            },
          });
        try {
          await thepurplecard_backend.deleteCardById(id);  // 
        console.log("Card deleted from Motoko ✅");
        const updatedCards = await thepurplecard_backend.readCards();
        setCards(updatedCards); 
       
       /*  const updatedCards = cards.filter((card) => card.id !== id);
        setCards(updatedCards); */
  
        Swal.fire({
          title: 'Deleted!',
          text: 'The card has been successfully deleted.',
          icon: 'success',
          background: '#f3e5f5',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'my-ok-button',
            popup: 'large-alert',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-text',
          }
        });
      } catch (error){
        console.error("Error deleting card from Motoko ❌", error);
        errSound2.play();
        Swal.fire({
            title: '<span class="shaky-emoji">🥺</span>',
            text: "Hmm... something didn’t go as planned. Wanna give it another shot? 🌸", 
            confirmButtonText: 'ok',
            background: '#f3e5f5',
            customClass: {
            confirmButton: 'my-confirm-btn',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-text',
              popup: 'large-alert'
            }
        });
      }
      }
    });
  };

  const handleFinish = (id) => {
    finishSound.play();
    Swal.fire({
      title: "<span class='finish-str'>🌟</span> <br> From dreams to reality!",
      text: `Card number ${id} has been terminated.`,
      confirmButtonText: 'ok',
      background: '#322653',
      customClass: {
        confirmButton: 'my-ok-button',
        popup: 'large-alert',
        title: 'finish-title',
            htmlContainer: 'finish-text',
      },
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="App">
      <h1>The Purple Card</h1>
      <h2>Extract ideas from your mind to the world</h2>
      <div className="circles">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="circle3"></div>
      </div>
      <button className="Add" onClick={openAddModal}>
        {" "}
        Add Idea
      </button>
{cards.length === 0 && <p className="empty">No cards yet. Add the first idea!</p>}

      {modalVisible && (
        <Modal
          isEditMode={isEditMode}
          isViewMode={isViewMode}
          card={currentCard}
          onClose={closeModal}
          onSave={saveCard}
        />
      )}
      <div className="cards-container">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            content={card.about}
            onDelete={deleteCard}
            onEdit={() => openEditModal(card)}
            onFinish={handleFinish}
            onView={() => openViewModal(card)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
