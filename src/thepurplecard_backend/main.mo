import List "mo:base/List";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor DPurplecard {

  public type Card = {
    id : Nat;
    title : Text;
    about : Text;
    content : Text;
  };

  stable var cards : List.List<Card> = List.nil<Card>();
  var nextId : Nat = 0;

  public func createCard(titleText : Text, aboutText : Text, contentText : Text) : async () {

    let newId : Nat = nextId;
    nextId := nextId + 1;
    let newCard : Card = {
      title = titleText;
      about = aboutText;
      content = contentText;
      id = newId;
    };

    cards := List.push(newCard, cards);
    Debug.print("✅ Card created with id=" # debug_show (newCard.id));
  };

  public query func readCards() : async [Card] {
    return List.toArray(cards);
  };

  public func deleteCardById(targetId : Nat) : async Bool {
    cards := List.filter<Card>(cards, func(card) { card.id != targetId });
    return true;
  };

  Debug.print(debug_show (cards));

  public func updateCardById(targetId : Nat, newTitle : Text, newAbout : Text, newContent : Text) : async Bool {

    cards := List.map<Card, Card>(
      cards,
      func(card) {
        if (card.id == targetId) {
          return {
            id = card.id;
            title = newTitle;
            about = newAbout;
            content = newContent;
          };
        } else {
          return card;
        };
      },
    );
    return true;
  };

};
