# qmv-phase1

I am using Railway.comto create a web app for music videos. There are 3 parts to this: Information, Music, Video Information:

1. Customer Info: Name, age, email address, length of video, age of audience (under 6, 6-12, 13-18, 18+, All Ages) 

2. Music Info: 

2A. Customer is given limited options: is there is a particular song to reference? I there a particular artit or group to reference? Then they are asked the overall tone (i.e. happy, sad, excited, morose, etc) and speed (very slow, slow, medium, fast, very fast), and then a blank field for anything else. 

2B. Advanced option. They are given a series of terms they can choose from that help describe the music: Genre: Pop, Rock, Hip-Hop, Electronic, Jazz, Classical, R&B, Country, Reggae, Blues, Metal, Folk, Disco, Funk, Soul, Punk, Ambient, World, Latin, EDM Vocal Style: Belting, Falsetto, Whispered, Spoken-Word, Rap, Harmonized (stacked vocals), Melismatic (ornamented runs), Staccato, Legato, Gritty Mood & Energy: Uplifting, Melancholic, Energetic, Chill, Dark, Bright, Tense, Relaxed, Euphoric, Introspective Highlighted Instruments: Electric Guitar, Acoustic Guitar, Bass Guitar, Piano, Synthesizer, Drums, Percussion, Violin, Cello, Cow Bell, Double Bass, Saxophone, Trumpet, Trombone, Ukulele, Bagpipes, Steel Drums, Harp, Banjo, Theremin Tone: Warm, Bright, Dark, Airy, Gritty, Raw, Polished, Ethereal, Vintage, Modern, Minimalistic, Cinematic, Organic, Synthetic, Dreamy Production & Effects: Reverb, Echo, Delay, Chorus, Distortion, Overdrive, EQ (Equalization), Compression, Auto-Tune, Wah-Wah, Tremolo, Pitch Shift, Vocoder, Sidechain, Filter Sweep, Fade In, Fade Out, Reverse, Build-Up, Drop And then have an open text field for whatever they want.  

3. After filling out the Music form, the client is now presented with a Video form. The video form already has the length, tone, age of audience, pulled over and unchangeable. The customer is presented with 3 options:

3A: The customer wants to use their own pictures.  If the customer wants to use their own images, we need to provide a temporary upload area. They should also be able to specify how long each image stays on screen—options like 1, 2, 4, 6, or 8 seconds. Based on the number of uploaded images and the selected duration per image, we can calculate the total video length using simple math. Initially, we'll offer a 30-second music clip. To match that length, customers can choose from three image upload options:
	• 30 images at 1 second each
	• 16 images at roughly 2 seconds each
	• 8 images at around 4 seconds each
We'll keep it simple by offering those three presets to start. Later, we can expand to support custom durations and dynamic audio selection.

3B: The user can also select custom AI-generated images. If this is the case, the customer simply gives us keywords or an official prompt to work from. Either way, there's going to be a suggestion button on the form which will take whatever they put so far in the form anywhere, combine it all together, and then try to come up with three suggestions of a quality topic. It may end up being three of almost the same thing. We don't know. It all depends on what the customer does. Once the image has been selected, it goes to AI to create a Master Image Prompt. So this will be a well-described high-def image that will become the basis of all the other prompts.

3C:  There will need to be a third option that is simply random. In this case, it is telling the AI to pick truly random, goofy, silly combinations of things. I

AI Integration

	• If a customer names an artist or a group, AI will create tags that help describe the artist's or group's most obvious and well known characteristics. 
	• If a customer names a particular song, AI will create tags that help describe the song's rhythm and tone.
	• If a customer uses the advanced selectors, Ai will take what they elected and integrate it into the music prompt.
	• If a customer puts anything into the open text field, AI will integrate it into the rest of the prompt .
	• On the Image Form, there is a SUGGESTION button. When selected, AI takes all of the information on the JSON and anything in the text fields to come up with 3 robust prompts the user can select from.

Deliverable:

	• A JSON with all the needed information stored in GCS


Customer gets to see the JSON and approve it or ask for improvements.

Payment: If the cutomer want to move froward, the pay screen appears.<img width="822" height="1590" alt="image" src="https://github.com/user-attachments/assets/7c7ea718-d2a5-4850-905f-4015650813f0" />
