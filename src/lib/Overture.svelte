<script>
  import { Layer, Ring, Line } from 'svelte-konva';
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;

  let ring;
  let horizontalLine;
  let verticalLine;

  const outerRadius = Math.round(xCentre * 0.8);
  const innerRadius = Math.round(xCentre * 0.7);
  const duration = Math.PI / 5;

  function dilateLeader(event) {
    bigBang(event.detail);
    contractLeaderBounds();
    findHorizontalExtent();
    findVerticalExtent();
  }

  function bigBang(singularity) {
    singularity.to({
      duration: Math.PI / 10,
      radius: Math.hypot(xCentre, yCentre)
    });
  }

  function contractLeaderBounds() {
    ring.to({
      duration,
      outerRadius,
      innerRadius
    });
  }

  function findHorizontalExtent() {
    const xPointA = xCentre - innerRadius;
    const xPointB = xCentre + innerRadius;
    horizontalLine.to({
      duration, 
      points: [xPointA, yCentre, xPointB, yCentre]
    });
  }

  function findVerticalExtent() {
    const yPointA = yCentre - innerRadius;
    const yPointB = yCentre + innerRadius;
    verticalLine.to({
      duration, 
      points: [xCentre, yPointA, xCentre, yPointB],
      onFinish: () => { dispatch('dilated') }
    });
  }
</script>

<Layer>
  <EllipticalCollapse on:collapsed={ dilateLeader } />
  <Line config={{
    points: [xCentre, yCentre, xCentre, yCentre],
    stroke: 'white',
    strokeWidth: 2,
    opacity: 1
  }} bind:handle={horizontalLine} />
  <Line config={{
    points: [xCentre, yCentre, xCentre, yCentre],
    stroke: 'white',
    strokeWidth: 2,
    opacity: 1
  }} bind:handle={verticalLine} />
  <Ring config={{
    x: xCentre,
    y: yCentre,
    innerRadius: 0,
    outerRadius: 0,
    fillEnabled: false,
    stroke: 'black'
  }} bind:handle={ring} />
</Layer>