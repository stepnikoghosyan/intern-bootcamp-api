export enum MessangerEvents {
  // Sender
  SendMessage = 'Messanger:Send',
  MessageSent = 'Messanger:Sent',
  MessageSeen = 'Messanger:Seen',

  // Receiver
  IsTypingNewMessage = 'Messanger:IsTypingNewMessage',
  NewMessageReceived = 'Messanger:NewMessageReceived',
}
