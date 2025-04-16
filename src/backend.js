import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as thepurplecard_backend_idl, canisterId as backendCanisterId } from "declarations/thepurplecard_backend";

const agent = new HttpAgent({
  host: "http://127.0.0.1:4943",
});


const backend = Actor.createActor(thepurplecard_backend_idl, {
  agent,
  canisterId: backendCanisterId,
});

export default backend;
