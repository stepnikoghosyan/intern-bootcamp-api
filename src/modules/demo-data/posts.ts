import { IPostItem } from './models/post-item.model';

export const posts: IPostItem[] = [
  {
    title: 'Best practices for a clean and performant Angular application',
    body: `This article outlines the practices we use in our application and is related to Angular, Typescript, RxJs and @ngrx/store. We’ll also go through some general coding guidelines to help make the application cleaner.

        1) trackBy
        When using ngFor to loop over an array in templates, use it with a trackBy function which will return an unique identifier for each item.
        
        Why?
        When an array changes, Angular re-renders the whole DOM tree. But if you use trackBy, Angular will know which element has changed and will only make DOM changes for that particular element.
        
        2) const vs let
        When declaring variables, use const when the value is not going to be reassigned.
        Why?
        Using let and const where appropriate makes the intention of the declarations clearer. It will also help in identifying issues when a value is reassigned to a constant accidentally by throwing a compile time error. It also helps improve the readability of the code.
        
        
        3) Pipeable operators
        Use pipeable operators when using RxJs operators.
        Why?
        Pipeable operators are tree-shakeable meaning only the code we need to execute will be included when they are imported.
        This also makes it easy to identify unused operators in the files.

        Note: This needs Angular version 5.5+.
        
        4) Isolate API hacks
        Not all APIs are bullet proof — sometimes we need to add some logic in the code to make up for bugs in the APIs. Instead of having the hacks in components where they are needed, it is better to isolate them in one place — like in a service and use the service from the component.
        Why?
        This helps keep the hacks “closer to the API”, so as close to where the network request is made as possible. This way, less of your code is dealing with the un-hacked code. Also, it is one place where all the hacks live and it is easier to find them. When fixing the bugs in the APIs, it is easier to look for them in one file rather than looking for the hacks that could be spread across the codebase.
        You can also create custom tags like API_FIX similar to TODO and tag the fixes with it so it is easier to find.
        
        5) Subscribe in template
        Avoid subscribing to observables from components and instead subscribe to the observables from the template.
        Why?
        async pipes unsubscribe themselves automatically and it makes the code simpler by eliminating the need to manually manage subscriptions. It also reduces the risk of accidentally forgetting to unsubscribe a subscription in the component, which would cause a memory leak. This risk can also be mitigated by using a lint rule to detect unsubscribed observables.
        This also stops components from being stateful and introducing bugs where the data gets mutated outside of the subscription.
        
        6) Clean up subscriptions
        When subscribing to observables, always make sure you unsubscribe from them appropriately by using operators like take, takeUntil, etc.
        Why?
        Failing to unsubscribe from observables will lead to unwanted memory leaks as the observable stream is left open, potentially even after a component has been destroyed / the user has navigated to another page.
        Even better, make a lint rule for detecting observables that are not unsubscribed.
        
        7) Use appropriate operators
        When using flattening operators with your observables, use the appropriate operator for the situation.
        switchMap: when you want to ignore the previous emissions when there is a new emission
        mergeMap: when you want to concurrently handle all the emissions
        concatMap: when you want to handle the emissions one after the other as they are emitted
        exhaustMap: when you want to cancel all the new emissions while processing a previous emisssion.
        
        8) Lazy load
        When possible, try to lazy load the modules in your Angular application. Lazy loading is when you load something only when it is used, for example, loading a component only when it is to be seen.
        Why?
        This will reduce the size of the application to be loaded and can improve the application boot time by not loading the modules that are not used.`,
    imageUrl:
      'https://lh3.googleusercontent.com/fife/AAWUweXb57Sb7ETPRr9PMcd2AzukHaaCNH27AUXVtFpyarzgGRDPJ6eZvgb8xt7WzHDhdtcDFdOvpR-QLE9Xw8X2_yCwUHiOLahSEp4bKKDcDPMCrSpjfOu_oCWa46k1DlXYT6BuKulqzFZLRkX6nSpb1RT9Dlwh7KvIWg4zwlFtKmvMM3Ret2jxWXGNgy7i8-KyuNR73GJahdtT3dH_GPGJwJb_D8jlyx1324_tCuw_7ejq7q26-9ixdPbGddnImv_k80SeE9ejDQugA8Lkre68yMVHlL9q-ml5FrVLD6XQSFg__CtiBjlF4EMvug4GXJLEd4Zc3w59IZ6b_P-Pif6WGCKakDctLZ1LfxjJ_rxopAy7vEUfCc0cp677_j1-qMkcNofFdwaw6w36vO3ab5HP2aB-lL_O9HtBell25VPMTMyU9WAL-5EDvIpLBXzxnJvSTBAasPSqVuf_qAJtqPmX6eelBQc9RTL_bLaHPBmIeUArDpQ1slpbGLFhavcoQ0xEMOMhMlJ3L1foppVE4LpxIeAO-_obeu9FamcOojDwoHa7-Uyvrm1dOcuGiPdiLKVkbbOy7Oh9s3cGukVlF322UmV3Xl-r3_2XYfbnj3WFZR8PHAQfV-cd9MMycs5d8IQcEjy6uJhHhoYIAHGlR0o1umt_QWtoZD6MLWXShWm8rkr15Pz7Ad0W7aixANpSs90zQw8zGrOv0m8J4t8BlRZQrJhsz_eclbh_jemu5WXBm-ZdSgHwHUlP3B66UlXju2H9HNaAVQN1F1o291lRn9E=w3840-h1882',
    fileType: 'jpg',
  },
  {
    title: 'Why do people post everything about their lives on Facebook?',
    imageUrl:
      'https://lh3.googleusercontent.com/fife/AAWUweU5Ke4N13scL2Pm0UyTbAE-eKwVZTLPsnE8U2ecDfSm7crZmJM-TCShoNNgxDZxldQnAYytcNgG3LRtpfRAuZZsvmEligI3cvUf_-wPFyAHW9ZWqe4AJLveV0woGjR8Cy2wsEnilbi16WCF9f14notTBNXU6Hk5hFrUqeGD1xIQR88hiBTXPgIjULLOMWPYQHkDG1PaYYPPM6HgJCMcGw2i-BErqVR0h3lUak-7E_sduCLX1xhRnGj9cbv_xbsAJf2FllW0zz-yFO_8XIM8UJG5-taV-esxwuFSCMZrARarTAJ8O1Eqv1m8zrfKWnefABo0lKRhYhq6oXQ8nCIin8y5Vh82PmLnE8njEQhUeeOt1WL-4VDOkuDIkMONwSP9gE-oOVtYaJFk2jx0o0P3yOLjeg3Fk9f0TisNfafTtYjgh1nY9Ssf5xGkCG7dob3Tjm72RjvRWuyuvKo8pnDoN8735CotuxCsCmODKBEe-x3qp0BByvJNO6ViRnGHqAmrzRRDxn6K1cR5g3NRek-25MFYekME63O2bzrAn2dNFyRhOWOjBgmXZzXKwzf4fFwvx_NV8FfowHqRiNd6p7dpWplVm3DV3T5L4t7spC1L6JVpFNleFDMEyaR466B4BntEnCFKK1jWTrTzC0N8aMsCxHHz0wmw1xAp5DL7CQj6vWFNYhTiqhJrDdAHtZ0_c1kJpTfvFzHxW9aviZBBYAEj-iHuYTo0J37oyu3Pl8VolCv3FFUAXnTxoepVmnA0svM0LsUD0mQPuorOlkJrCVA=w3840-h1882',
    fileType: 'jpg',
    body: `1.
      They are attention seekers
      Attention seekers might do anything to grab the attention of others. This desire to grab attention might motivate those people to keep posting anything that happens to them on social networks.
      
      2.
      They are easily provoked
      People who are easily provoked are more likely to speak about the things that triggered their emotions. Those people are more likely to share everything online.
      
      3.
      They are narcissists
      Not all narcissists share their personal life details with others, but some of them do. A narcissist believes that they are very important and so they believe that everything they say or share is of extreme importance.
      
      4.
      They are lonely
      According to psychologists, a person might post many details about their lives if they feel lonely. Those people might do so in order to connect with others and experience some intimacy.
      
      5.
      They have over-active brains
      People who have an overly active medial prefrontal cortex, the area responsible for personality expression, might be hardwired to share more. Some scientists believe that those people are hardwired to be this way.
      
      6.
      They don’t have privacy concerns
      Some people don’t have any kind of privacy concerns. Those people don’t mind sharing every little detail about themselves online.
      
      7.
      They have a self-regulation problem
      A person who has a self-regulation problem might find it hard to prevent themselves from sharing private information of themselves online.
      
      8.
      They are overly trusting
      People who trust others very easily might have no problem posting private information about themselves online.
      
      9.
      They are insecure
      People who post very often might be insecure about themselves and their self-image. Those people might keep posting in order to change other’s opinion of them.`,
  },
  {
    title: '10 amazing facts about dogs',
    imageUrl:
      'https://lh3.googleusercontent.com/fife/AAWUweVUOUIeFFN1nqsLmJNoaVH0bgAzgynf_dEy991LdDJqG1xT1njdzQccrXhcxQO0ZfiEt_wx_EGyAbMhYy8em6csiQ1jaNIHvUoOlp5rtGC-FigcLtFRj3bGpbMD00S1LybMjjXKF74QkJ0lXh9e6aLIAuHv8ZO5LE-YLV3lkmhBB0qQmQ_3o2EQ8RLgrYoneI7u8tGs7ZsCsCkMjKJ_blRrxtyFE4UbB4U20VfAfadrgFhHvroJ3z6K1dJTJTVKaJpAKFqYrAntzUkXxc_VBykTe8hyJxxbneR28n8AfVjsJtoXlQ318jZ6e8AV3ykDAH8AwinkfCEve6p9JqTDBtVuLPqSs7vQ1dQjJNbhohmdcWgN99iwBOcdH44OpFaXfIb8OvvoFN0IcMIYFBLafKxsWE0e2Xw2WsaEI0erWKWQP-q1ieab_SdJVd6d77JzSAM1Y9Y-cy63eIoWnM2KlcRV4TOEsECZBMJ9jbdkRBbrO2hcKNZsVYHFw85FCI_3ZHWg_D1L_wF8-sSDdacPiv5arvFuTZ93SA1Own3YmZLT7W7zJb6dikyIXTFKRcDqkS3KUr9LAaYLXsRc0TnXrkaaMqm3wsKL0Ceuko7ZtnSEwjd8occve7MtfCsdvX0Lbz8-7iLIFRMZPB-5Xnm1B-D9y9etDF1G5DJw3SAjK5klk_S28rjFK0lCP8zXAf3zwaDRaB_F1gt1Vs2Z_krfO_dtxmD2R1BwyUkYp1XDer2-LpAJcFJAHSxNj8DevJDUnK5nY_socfEIQRlwC3Y=w3840-h1882',
    fileType: 'jpg',
    body: `Dogs are great – they provide us with love, companionship and are always there when we need them. But did you know there’s far more to dogs than meets the eye?

      We all know dogs have been ‘man’s best friend’ for thousands of years, but there’s loads more to our four-legged friends which makes them really amazing.
      
      We’ve put together some of our favourite canine facts so you can learn a little more about your pooch.
      
      1. Their sense of smell is at least 40x better than ours
      The area of cells in the brain that detect different smells is around 40 times larger in dogs than humans. This means that your dog can pick up on way more smells than we ever could. This is why dogs are often used to sniff out people, drugs and even money!
      
      2. Some have such good noses they can sniff out medical problems
      Yup, medical detection dogs are a thing. Because their sense of smell is so great, some dogs can be trained to sniff out medical conditions. They are used to diagnose a particular condition or to alert their owners if they need more medication. Some are even being trained to sniff out Covid-19!
      
      One of these incredible dogs is Medical Detection Dog Pal (pictured above), who was awarded the PDSA Order of Merit. Pal played a vital role in diabetic owner Claire’s life by alerting her of changes in her blood sugar. If not caught in time, these changes could have killed her.
      
      3. Dogs can sniff at the same time as breathing
      Dogs rely a lot on their sense of smell to find food, potential dangers, and friends, so needless to say they sniff a lot. Their noses are designed so smells can stay in their nose while air can move in and out of their lungs at the same time, which means they can breathe freely and still work out what that smell is!
      
      4. Some dogs are incredible swimmers
      So, not all dogs like water, but the ones that do tend to be pretty good swimmers (but again, not all are so always keep an eye on your dog in case they decide to take a dip out and about).
      
      Newfoundlands are so good in the water that for years they’ve been used as water rescue dogs. In 2016, a brave Newfoundland called Whizz was awarded the PDSA Order of Merit for saving nine people from the sea over his career as a water rescue dog.
      
      5. Some are fast and could even beat a cheetah!
      Most dogs could easily outrun a human – they’re built to run and chase! The fastest breed of dog by far, though, is the Greyhound. These speedy sight hounds can reach a top speed of 45mph within seconds of starting to run
      
      ‘But how does this beat a cheetah?’ we hear you ask. Well, while a cheetah can get up to almost 70mph, they can only keep this going for around 30 seconds. Greyhounds, on the other hand, could easily run at speeds in excess of 35mph for seven miles. So despite the cheetah’s head start, they’d soon overtake!
      
      6. Dogs don’t sweat like we do
      While dogs do sweat, don’t expect them to be getting damp armpits any time soon. Where humans sweat watery liquid to cool down, dogs produce a pheromone laden oily substance that us humans can’t detect (dogs know it’s there because of that great sense of smell). The only place that dogs sweat like us is on their paws, so instead they pant to cool down. This is why it’s so important to keep your dog cool on those warmer days to make it easier on them.
      
      7. Your dog could be left or right-pawed
      There have been a few studies around this and it turns out that just like us, dogs have a preferred hand (well, paw) to lead with. You can find out whether your dog is left or right-pawed by giving them their favourite toy or interactive game and seeing which paw they use to help them first.
      
      8. Along with their noses, their hearing is super sensitive
      We all know dogs can hear much higher frequencies than us, but did you know they can also hear further? Generally, dogs can hear much softer sounds than we can, so they can hear things that are much further away.
      This is another trait that makes them great search and rescue dogs. While they will mainly use their nose for tracking, their hearing can also be a real help (especially as they get closer to whatever they are looking for!). Dogs like K9 Killer (pictured above), who was awarded the PDSA Gold Medal for helping to track down Rhino poachers, are excellent at tracking using both smell and hearing.
      
      9. Dogs have 18 muscles controlling their ears
      If you have a dog, you might notice that their ears move around a lot. They actually have around 18 muscles responsible for moving their ears. These help them to change the direction of their ears slightly to hear noises around them better, and play a really big part in telling us how our dogs are feeling. A lot of a dog’s body language is expressed through what their ears are doing so a dog’s ears are vital in helping them communicate both with us and other dogs.
      
      10. Dogs are about as intelligent as a two-year-old
      Studies have shown that dogs can learn over 100 words and gestures, which puts their intelligence and understanding of us on a par with a two year old. However, dogs are much easier to train than a two year old! They’re used for all sorts of jobs, from military roles to assistance dogs, because they’re both clever and extremely loyal animals.`,
  },
  {
    title: 'Information technology (IT)',
    imageUrl:
      'https://lh3.googleusercontent.com/fife/AAWUweWmG0_mjy3wB-vOOL7c9m9k4ScDoOSbIDGCnEqVX5Q3UNS0a0m6ppIV6K5NVW9rGMExekyhC76TXoXwHRw558beF03xoV2nZPnSKo1yQCYfEkye0CbjGYSf5xplc7PrLAKoKBGbEozFs3VCYDAYODTzaMYlRUTnsezuopfJFnygywq1hPD3i_ubhtYWbAmDNQrQ6WexcAROb2QwG0XyqxPzG1Vsstz1_NXiVmcxMwqA7y6b2LkIHsT3ZOyoovWIjGkw8N9156Zt_eIgWRdjVFz7wugEnuZhf0xrvxOnaiBZp_WhiE3hZt7d-FNnlXeS6u23Bmp1ZjfjbU9tnLU7afej7081pW4dqKUNF5XJbatFwgoFVPDntGWX6MZra4aQDHJE0iZR708rzbcJOyhac6AX6DMFUhosWJJXOblRnxNYT-i7Mxjw61ARMkkhUqey0HW5srszYj0KEOkQXhfGz6nJVxu4rOFbE4upfwnm4KoUPM5yDDXpkytvLnWieulVHZoomgcNktOpMML3io4zsaMRVsSUb-uO-5_jZ2kndoGLSqLUEWA6mXdnOcS1vBF-VYCN3SxzQUGcGBWPX0cpvCZEqbJhEj05WLkAqXIPBP5os-KAgcKpgKmnBNulkC8VqWeNb2qXTOl3Gsc1p2fMn2H1_JiEOnMNM_gA3FQrfacIAhN7a454uIGXQJhS76QxRtLFjCm9LxVSZIUAwQfr10NYMa5SUE2CZYKdySO9QHkcNPL_sEQBaPOYKeMZoG72MetduDJ4ouqaDYmtvgQ=w3840-h1882',
    fileType: 'jpg',
    body: `Information technology (IT) is the use of computers to create, process, store, retrieve, and exchange all kinds of electronic data and information. IT is typically used within the context of business operations as opposed to personal or entertainment technologies. IT is considered to be a subset of information and communications technology (ICT). An information technology system (IT system) is generally an information system, a communications system, or, more specifically speaking, a computer system — including all hardware, software, and peripheral equipment — operated by a limited group of IT users.

      Humans have been storing, retrieving, manipulating, and communicating information since the Sumerians in Mesopotamia developed writing in about 3000 BC.However, the term information technology in its modern sense first appeared in a 1958 article published in the Harvard Business Review; authors Harold J. Leavitt and Thomas L. Whisler commented that "the new technology does not yet have a single established name. We shall call it information technology (IT)." Their definition consists of three categories: techniques for processing, the application of statistical and mathematical methods to decision-making, and the simulation of higher-order thinking through computer programs.
      
      The term is commonly used as a synonym for computers and computer networks, but it also encompasses other information distribution technologies such as television and telephones. Several products or services within an economy are associated with information technology, including computer hardware, software, electronics, semiconductors, internet, telecom equipment, and e-commerce.
      
      Based on the storage and processing technologies employed, it is possible to distinguish four distinct phases of IT development: pre-mechanical (3000 BC — 1450 AD), mechanical (1450—1840), electromechanical (1840—1940), and electronic (1940 to present).
      
      Information technology is also a branch of computer science, which can be defined as the overall study of procedure, structure, and the processing of various types of data. As this field continues to evolve across the world, the overall priority and importance has also grown, which is where we begin to see the introduction of computer science-related courses in K-12 education. However, concerns have been raised about this fact that most schools are lacking advanced-placement courses in this field.`,
  },
  {
    title: '4 Harmful Myths That Hurt Cats',
    imageUrl:
      'https://lh3.googleusercontent.com/fife/AAWUweU4jtDn0k0XR7S3f2qlOfbUzFyH9E7_fo7QoZRyieCxCcRxpAwylgBQEpxfh092HeVOXjHBy_FDFrCwDrA8n-YIJAVFiE1AeBYtt0rBIiHLNcJOhr_c804zwzvESVBIycNPw_-fkeqUPjsO3knun_9ID-yR6VFLYOIOXPPsOnS68cPw091EPv3Pa8DxEeZ2rlRQd92B8ec81j3MZogyJP7xedaTeB8G_INLP6BLKnWRPmUu6MZFmAen1kKok2lT2tYOgg0zqq2Q0OLRsysmhazZL9PF9NDqE3HCMOFuUZgRr-TJtrz1-zZ03FQZrjSF7MqPUOqoRD6Ep4XzbKNFWttYQcmc6NzBRexZkvUxFJ4MXytMYERWy-Uys-6d7YSF1LAcDGfwgppst2__09_KdtYunnuwkQ0-K4t9Gw1Njw8G7H-Lc2yI_TsCoYVz90QvH94ZcfftMSqFf96omEtWEEFwlKfxDl-lCr5KfI1t3HyKmP3ubO8-eXbxNZKafKVpqWMVRm7LLMmVxhDs5s5WjkT1EbMs771Ogjmq5SCD3HpJ54R3u7QZJrXslQL2Iok99f2DwJczeJUWraG_svvFBgsWwGuT_ZrLw6ATq74LxghLuwm1Ot9qTsRLv_KLCTj2d6wpZu77tUf1wrksUWIIqa9J95zyA8aEFfPAvBqTJRIf7hUm5-pc_o5k33J_KE2feBmOrOLZSUzUy2ulAORCZA7X8-4f4bFxRC1j3PYKRw1SHF0g-mHK7-1ujm8ozeL6p0bdcEOtTYQboAktKd0=w3840-h1882',
    fileType: 'jpeg',
    body: `Cats are mystical animals. Pop culture would have you believe they’re capricious, confusing, clever, and conniving. Cat people (or the people who belong to cats, in more accurate terms) have struggled for millennia to understand cats and their mysterious appeal to humans.
    The problem with mysticism, of course, is that it gives rise to conspiracy theories that somehow end up being treated as fact — or even policy, in certain cases. People operate under the misguided belief that cats are evil, that cats can’t love, that cats need to be declawed, and that cats destroy stuff just for the hell of it.
    Let’s debunk four common cat misconceptions that are actively harming cats:
    
    1. The ‘empty’ food bowl myth
    One of the funniest cat memes on the internet is that cats think they’re “starving” when their bowl has plenty of food in it, just pushed to the sides.
    Nobody talks about the true reason. Cats aren’t being capricious, lazy, or stupid. They’re being sensitive.
    Cat whiskers are finely-tuned instruments of detection, effectively giving them a whole new sense and tons of extra information according to Live Science. Unfortunately for them, this means they also get what Pet MD calls whisker fatigue. When your cat is eating out of a bowl and his whiskers are repeatedly hitting the sides, this can actually be too sensitive or even painful for his delicate senses.
    So they eat what they can — the middle — and leave what is literally too painful for them to eat.
    This myth has fueled many a meme, but can cause harm to cats because it makes you believe your cat is being intentionally duplicitous or lazy. They’re not — they just have delicate whiskers. Consider a wider bowl that lets them eat in peace.
    
    2. The spiteful behavior myth
    My cat, Astrid, started peeing all over the house. Obviously, I was annoyed — have you ever smelled cat pee? It’s nasty. Plus, I was doing everything right: I had three litter boxes, I kept them all clean, I made sure she had enough water. But still she peed.
    
    My first thought was that she was punishing me, or that she was just doing it to spite me. But on a hunch, I took her to the vet where I found out she had a urinary tract infection which was causing her to act up.
    Cats don’t show pain! They hide it because by nature they try to disguise any vulnerabilities. Instead, cat people need to look for clues in their behavior. A lot of what we could consider “bad” or “rude” behavior is actually our cats trying desperately telling us they’re in pain.
    
    3. The myth that cats need to go outside to live happy and fulfilled lives
    Cats are domesticated animals, which means they can live perfectly happy and healthy lives indoors. In fact, letting them go outside shortens their lifespan, contributes to a huge amount of biodiversity loss, and doesn’t provide them with many benefits.
    Cat people often believe that their cats are bored, so they put them outside to relieve that boredom. Cats are often bored, and need more territory, but there are safer alternatives.
    Cats have a three-dimensional view of their territory. By installing tall cat trees (I love Cat Kings trees for my cats), as well as spending more time with your cats and providing a diversity of toys can relieve them of their boredom and territorial disputes.
    
    4. The ‘cats don’t love you’ myth
    This is a myth perpetrated primarily by the “dog person” community. Again, when compared to dogs, it might seem like cats don’t love humans, they just see us as convenient tuna can openers. This can lead to a stereotype of cats as ungrateful jerks, which in turn can cause a lot of pain for cats.
    People believe this myth because we have a very ingrained idea of what love looks like, and cat love doesn’t always meet it. Dogs show their love in obvious ways that match human behavior more closely, so no one questions their affection.
    But cats do love us, just not always in the ways we know to look for. Nobody questions a baby’s love for their parents, even though babies scream, cry, refuse to explain their moods, and produce vile odors. Cats are the same. They love us, they rely on us, they trust us and they need us.`,
  },
  {
    title: 'Self-driving cars are here',
    imageUrl:
      'https://lh3.googleusercontent.com/fife/AAWUweXTuyiz6XtqlcstrcpBcAScZtkH92YwRrG8qynZ4JKbvCEwaCAU5BHzmRGg1ABzMCxsu98zTPNcAVpqwLB6UYuGKk7gfO1bWvDiyYizyudATJXhuRRHpClv6e7oOEx4HomGNCi9eKufVkoNptA1lZDbPkYnBguZNRB-uQiIBII7mQDbxd1EGRxa8cXFr_1rOv2mZWb19vx3m_7tgwlfjT_YFCs87vbbVElZHkHj9BK7qJlc5I4cUB84NSlzet1LHkHYEgAwdQWYzyEOmSbOVBK1LFSRPqx9E2JkmRCFA5T0Yh2GqhwZhjIqEcGuTXRPZ4KuU2bXdQFrwsSC86DDU4ZC_YTyx8KEBh8WMzV3jJDK0gOSpT-eTt-InfX3Qx9C7Rtu9vMuovEtSOfxA9S9LA9RW32J4FnRL2YxurcGu4KuuOEh3pGAZj2_ThAPYiHOOt0WgCbi-Bm2lUpqDeFM3aNlJOwLHKHe7vwq2VOxEn9Dq1MPk-DWkdFRyQY5kMhL1puljgwj5o1QLdRsrvmKmFjR2ptLjodAhvF3Ao7UxIW17MX98h5e4yZu5FA5OqZQnIJb6G5eH6Va-KxAO4EFA7F4cn8f2REeWW7pG8RlSjRBWhRfBiIrPA_xjg3KnGu6HY9BdacioM39KmewX_wkTMz-Yn2wE3L3H7DlI2UHkWsguPMSegH4zYPXZDZPYMXHbw-f-503Sl7fj0EABluOZMaXs09xri7hFkDOVZwY7BbVtozm9G1fMFyRN8hMig0_GnZDV20czHrVH0HBX0Q=w3840-h1882',
    fileType: 'jpg',
    body: `Self-driving cars are no longer a futuristic AI technology. They’re here, and will soon make transportation cheaper and more convenient.
      The team at Drive.ai has been working closely with local partners to ensure the deployment of our cars is safe and adds real value to its day-to-day users.
      
      The self-driving car roadmap
      1. Providing a public self-driving car service depends on three key elements:
      2. Technology: Industry-leading AI and deep learning
      3. Partnerships: Deployments through working with public and private partners
      4. Safety: People-centric safety
      
      
      1. Technology: Industry-leading AI and deep learning
      Self-driving technology is still challenging. It requires highly skilled AI teams as well as sophisticated software and hardware architectures.
      Drive.ai has always had a strong technical team; its founders include many AI graduate students from my group at Stanford University as well as Carol Reiley (my spouse). Comprised of deep learning natives, the team has designed a self-driving architecture using modern AI from the ground up.
      Further, by developing the full software stack for self-driving in-house — -perception, motion planning, mapping, localization, fleet management software, mobile app, communications, our “tele-choice” remote assistance system, and more — the team is able to move quickly and resolve any dependencies between systems.
      
      2. Partnerships: Deployments through local partnerships
      Self-driving cars should be deployed in geofenced areas in partnership with governments and private parties to ensure safe, smooth operations that add value to its day-to-day users
      As a skilled AI team, Drive.ai has a clear-eyed view of AI’s limitations. The team knows how to build realistic solutions within the current technology’s limitations.
      For example, no self-driving team has a realistic roadmap to reliably interpret the hand gestures of a construction worker waving for a car to proceed; computer vision just isn’t good enough yet. Thus, we are partnering with governments and private parties to deploy in geofenced regions, where we can find other ways for construction workers to communicate with our fleet operations team.
      Drive.ai is particularly grateful to Frisco’s Mayor Jeff Cheney, Frisco TMA, and NCTCOG’s Michael Morris for their partnership. Working together, our initial pilot will be a six month deployment on a driving route from HALL Park to an entertainment/retail area (The Star), with a planned expansion into Frisco Station.
      
      3. Safety: People-centric safety
      The industry must take a human-centered approach to safety — taking into account both people inside and outside the car — and emphasize communications and community education.
      Whether a self-driving car is safe depends not only on the behavior of the car itself, but also on the behavior of the people around it. It is unwise to rely exclusively on AI technology to ensure safety. Instead, the self-driving industry also has to think about the people who will be outside the vehicle, which is why we will be undertaking community-wide education and training programs where we operate.
      
      The steps toward driverless deployment
      In the first phase, Drive.ai will deploy vehicles with safety drivers in Texas. We are also deploying our “tele-choice” technology to provide a high level of safety and ride comfort. For example, say our vehicle wants to execute a tricky maneuver at an intersection. If it determines that it needs human insight for an additional layer of safety, it will first pull to a stop, then seek input from a remote operator to proceed. Over time, our deep learning system learns from these cases and improves automatically. Unlike “remote driving,” where a tele-choice operator controls the car directly, our tele-choice system is designed to be robust to network latency and temporary network outages, taking into account even small edge cases like automatically invalidating stale data or requests lagging by 100 ms.
      In the second phase, when road tests show it is safe to do so, Drive.ai will operate with “chaperones” (rather than safety drivers) alongside tele-choice operators. The chaperone will sit in a passenger seat and be available to assist passengers and monitor operations, but they will not be expected to take over in a split-second.
      In the final phase, we will operate with only passengers in the vehicle, assisted remotely by tele-choice operators. One tele-choice operator will be able to monitor multiple vehicles, thus enabling more scalable deployments of self-driving.`,
  },
];
