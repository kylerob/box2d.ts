/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["../../Common/b2Settings", "../../Common/b2Math", "../../Collision/b2Collision", "../b2TimeStep"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Collision_1, b2Collision_2, b2TimeStep_1, b2VelocityConstraintPoint, b2ContactVelocityConstraint, b2ContactPositionConstraint, b2ContactSolverDef, b2PositionSolverManifold, b2ContactSolver;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
                b2Collision_2 = b2Collision_1_1;
            },
            function (b2TimeStep_1_1) {
                b2TimeStep_1 = b2TimeStep_1_1;
            }
        ],
        execute: function () {
            b2VelocityConstraintPoint = class b2VelocityConstraintPoint {
                constructor() {
                    this.rA = new b2Math_1.b2Vec2();
                    this.rB = new b2Math_1.b2Vec2();
                    this.normalImpulse = 0;
                    this.tangentImpulse = 0;
                    this.normalMass = 0;
                    this.tangentMass = 0;
                    this.velocityBias = 0;
                }
                static MakeArray(length) {
                    return b2Settings_1.b2MakeArray(length, (i) => new b2VelocityConstraintPoint());
                }
            };
            exports_1("b2VelocityConstraintPoint", b2VelocityConstraintPoint);
            b2ContactVelocityConstraint = class b2ContactVelocityConstraint {
                constructor() {
                    this.points = b2VelocityConstraintPoint.MakeArray(b2Settings_1.b2_maxManifoldPoints);
                    this.normal = new b2Math_1.b2Vec2();
                    this.tangent = new b2Math_1.b2Vec2();
                    this.normalMass = new b2Math_1.b2Mat22();
                    this.K = new b2Math_1.b2Mat22();
                    this.indexA = 0;
                    this.indexB = 0;
                    this.invMassA = 0;
                    this.invMassB = 0;
                    this.invIA = 0;
                    this.invIB = 0;
                    this.friction = 0;
                    this.restitution = 0;
                    this.tangentSpeed = 0;
                    this.pointCount = 0;
                    this.contactIndex = 0;
                }
                static MakeArray(length) {
                    return b2Settings_1.b2MakeArray(length, (i) => new b2ContactVelocityConstraint());
                }
            };
            exports_1("b2ContactVelocityConstraint", b2ContactVelocityConstraint);
            b2ContactPositionConstraint = class b2ContactPositionConstraint {
                constructor() {
                    this.localPoints = b2Math_1.b2Vec2.MakeArray(b2Settings_1.b2_maxManifoldPoints);
                    this.localNormal = new b2Math_1.b2Vec2();
                    this.localPoint = new b2Math_1.b2Vec2();
                    this.indexA = 0;
                    this.indexB = 0;
                    this.invMassA = 0;
                    this.invMassB = 0;
                    this.localCenterA = new b2Math_1.b2Vec2();
                    this.localCenterB = new b2Math_1.b2Vec2();
                    this.invIA = 0;
                    this.invIB = 0;
                    this.type = b2Collision_2.b2ManifoldType.e_unknown;
                    this.radiusA = 0;
                    this.radiusB = 0;
                    this.pointCount = 0;
                }
                static MakeArray(length) {
                    return b2Settings_1.b2MakeArray(length, (i) => new b2ContactPositionConstraint());
                }
            };
            exports_1("b2ContactPositionConstraint", b2ContactPositionConstraint);
            b2ContactSolverDef = class b2ContactSolverDef {
                constructor() {
                    this.step = new b2TimeStep_1.b2TimeStep();
                    this.count = 0;
                    this.allocator = null;
                }
            };
            exports_1("b2ContactSolverDef", b2ContactSolverDef);
            b2PositionSolverManifold = class b2PositionSolverManifold {
                constructor() {
                    this.normal = new b2Math_1.b2Vec2();
                    this.point = new b2Math_1.b2Vec2();
                    this.separation = 0;
                }
                Initialize(pc, xfA, xfB, index) {
                    const pointA = b2PositionSolverManifold.Initialize_s_pointA;
                    const pointB = b2PositionSolverManifold.Initialize_s_pointB;
                    const planePoint = b2PositionSolverManifold.Initialize_s_planePoint;
                    const clipPoint = b2PositionSolverManifold.Initialize_s_clipPoint;
                    // DEBUG: b2Assert(pc.pointCount > 0);
                    switch (pc.type) {
                        case b2Collision_2.b2ManifoldType.e_circles: {
                            // b2Vec2 pointA = b2Mul(xfA, pc->localPoint);
                            b2Math_1.b2Transform.MulXV(xfA, pc.localPoint, pointA);
                            // b2Vec2 pointB = b2Mul(xfB, pc->localPoints[0]);
                            b2Math_1.b2Transform.MulXV(xfB, pc.localPoints[0], pointB);
                            // normal = pointB - pointA;
                            // normal.Normalize();
                            b2Math_1.b2Vec2.SubVV(pointB, pointA, this.normal).SelfNormalize();
                            // point = 0.5f * (pointA + pointB);
                            b2Math_1.b2Vec2.MidVV(pointA, pointB, this.point);
                            // separation = b2Dot(pointB - pointA, normal) - pc->radius;
                            this.separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pointB, pointA, b2Math_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                            break;
                        }
                        case b2Collision_2.b2ManifoldType.e_faceA: {
                            // normal = b2Mul(xfA.q, pc->localNormal);
                            b2Math_1.b2Rot.MulRV(xfA.q, pc.localNormal, this.normal);
                            // b2Vec2 planePoint = b2Mul(xfA, pc->localPoint);
                            b2Math_1.b2Transform.MulXV(xfA, pc.localPoint, planePoint);
                            // b2Vec2 clipPoint = b2Mul(xfB, pc->localPoints[index]);
                            b2Math_1.b2Transform.MulXV(xfB, pc.localPoints[index], clipPoint);
                            // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                            this.separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(clipPoint, planePoint, b2Math_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                            // point = clipPoint;
                            this.point.Copy(clipPoint);
                            break;
                        }
                        case b2Collision_2.b2ManifoldType.e_faceB: {
                            // normal = b2Mul(xfB.q, pc->localNormal);
                            b2Math_1.b2Rot.MulRV(xfB.q, pc.localNormal, this.normal);
                            // b2Vec2 planePoint = b2Mul(xfB, pc->localPoint);
                            b2Math_1.b2Transform.MulXV(xfB, pc.localPoint, planePoint);
                            // b2Vec2 clipPoint = b2Mul(xfA, pc->localPoints[index]);
                            b2Math_1.b2Transform.MulXV(xfA, pc.localPoints[index], clipPoint);
                            // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                            this.separation = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(clipPoint, planePoint, b2Math_1.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                            // point = clipPoint;
                            this.point.Copy(clipPoint);
                            // Ensure normal points from A to B
                            // normal = -normal;
                            this.normal.SelfNeg();
                            break;
                        }
                    }
                }
            };
            b2PositionSolverManifold.Initialize_s_pointA = new b2Math_1.b2Vec2();
            b2PositionSolverManifold.Initialize_s_pointB = new b2Math_1.b2Vec2();
            b2PositionSolverManifold.Initialize_s_planePoint = new b2Math_1.b2Vec2();
            b2PositionSolverManifold.Initialize_s_clipPoint = new b2Math_1.b2Vec2();
            exports_1("b2PositionSolverManifold", b2PositionSolverManifold);
            b2ContactSolver = class b2ContactSolver {
                constructor() {
                    this.m_step = new b2TimeStep_1.b2TimeStep();
                    this.m_allocator = null;
                    this.m_positionConstraints = b2ContactPositionConstraint.MakeArray(1024); // TODO: b2Settings
                    this.m_velocityConstraints = b2ContactVelocityConstraint.MakeArray(1024); // TODO: b2Settings
                    this.m_count = 0;
                }
                Initialize(def) {
                    this.m_step.Copy(def.step);
                    this.m_allocator = def.allocator;
                    this.m_count = def.count;
                    // TODO:
                    if (this.m_positionConstraints.length < this.m_count) {
                        const new_length = b2Math_1.b2Max(this.m_positionConstraints.length * 2, this.m_count);
                        while (this.m_positionConstraints.length < new_length) {
                            this.m_positionConstraints[this.m_positionConstraints.length] = new b2ContactPositionConstraint();
                        }
                    }
                    // TODO:
                    if (this.m_velocityConstraints.length < this.m_count) {
                        const new_length = b2Math_1.b2Max(this.m_velocityConstraints.length * 2, this.m_count);
                        while (this.m_velocityConstraints.length < new_length) {
                            this.m_velocityConstraints[this.m_velocityConstraints.length] = new b2ContactVelocityConstraint();
                        }
                    }
                    this.m_positions = def.positions;
                    this.m_velocities = def.velocities;
                    this.m_contacts = def.contacts;
                    // Initialize position independent portions of the constraints.
                    for (let i = 0; i < this.m_count; ++i) {
                        const contact = this.m_contacts[i];
                        const fixtureA = contact.m_fixtureA;
                        const fixtureB = contact.m_fixtureB;
                        const shapeA = fixtureA.GetShape();
                        const shapeB = fixtureB.GetShape();
                        const radiusA = shapeA.m_radius;
                        const radiusB = shapeB.m_radius;
                        const bodyA = fixtureA.GetBody();
                        const bodyB = fixtureB.GetBody();
                        const manifold = contact.GetManifold();
                        const pointCount = manifold.pointCount;
                        // DEBUG: b2Assert(pointCount > 0);
                        const vc = this.m_velocityConstraints[i];
                        vc.friction = contact.m_friction;
                        vc.restitution = contact.m_restitution;
                        vc.tangentSpeed = contact.m_tangentSpeed;
                        vc.indexA = bodyA.m_islandIndex;
                        vc.indexB = bodyB.m_islandIndex;
                        vc.invMassA = bodyA.m_invMass;
                        vc.invMassB = bodyB.m_invMass;
                        vc.invIA = bodyA.m_invI;
                        vc.invIB = bodyB.m_invI;
                        vc.contactIndex = i;
                        vc.pointCount = pointCount;
                        vc.K.SetZero();
                        vc.normalMass.SetZero();
                        const pc = this.m_positionConstraints[i];
                        pc.indexA = bodyA.m_islandIndex;
                        pc.indexB = bodyB.m_islandIndex;
                        pc.invMassA = bodyA.m_invMass;
                        pc.invMassB = bodyB.m_invMass;
                        pc.localCenterA.Copy(bodyA.m_sweep.localCenter);
                        pc.localCenterB.Copy(bodyB.m_sweep.localCenter);
                        pc.invIA = bodyA.m_invI;
                        pc.invIB = bodyB.m_invI;
                        pc.localNormal.Copy(manifold.localNormal);
                        pc.localPoint.Copy(manifold.localPoint);
                        pc.pointCount = pointCount;
                        pc.radiusA = radiusA;
                        pc.radiusB = radiusB;
                        pc.type = manifold.type;
                        for (let j = 0; j < pointCount; ++j) {
                            const cp = manifold.points[j];
                            const vcp = vc.points[j];
                            if (this.m_step.warmStarting) {
                                vcp.normalImpulse = this.m_step.dtRatio * cp.normalImpulse;
                                vcp.tangentImpulse = this.m_step.dtRatio * cp.tangentImpulse;
                            }
                            else {
                                vcp.normalImpulse = 0;
                                vcp.tangentImpulse = 0;
                            }
                            vcp.rA.SetZero();
                            vcp.rB.SetZero();
                            vcp.normalMass = 0;
                            vcp.tangentMass = 0;
                            vcp.velocityBias = 0;
                            pc.localPoints[j].Copy(cp.localPoint);
                        }
                    }
                    return this;
                }
                InitializeVelocityConstraints() {
                    const xfA = b2ContactSolver.InitializeVelocityConstraints_s_xfA;
                    const xfB = b2ContactSolver.InitializeVelocityConstraints_s_xfB;
                    const worldManifold = b2ContactSolver.InitializeVelocityConstraints_s_worldManifold;
                    const k_maxConditionNumber = 1000;
                    for (let i = 0; i < this.m_count; ++i) {
                        const vc = this.m_velocityConstraints[i];
                        const pc = this.m_positionConstraints[i];
                        const radiusA = pc.radiusA;
                        const radiusB = pc.radiusB;
                        const manifold = this.m_contacts[vc.contactIndex].GetManifold();
                        const indexA = vc.indexA;
                        const indexB = vc.indexB;
                        const mA = vc.invMassA;
                        const mB = vc.invMassB;
                        const iA = vc.invIA;
                        const iB = vc.invIB;
                        const localCenterA = pc.localCenterA;
                        const localCenterB = pc.localCenterB;
                        const cA = this.m_positions[indexA].c;
                        const aA = this.m_positions[indexA].a;
                        const vA = this.m_velocities[indexA].v;
                        const wA = this.m_velocities[indexA].w;
                        const cB = this.m_positions[indexB].c;
                        const aB = this.m_positions[indexB].a;
                        const vB = this.m_velocities[indexB].v;
                        const wB = this.m_velocities[indexB].w;
                        // DEBUG: b2Assert(manifold.pointCount > 0);
                        xfA.q.SetAngle(aA);
                        xfB.q.SetAngle(aB);
                        b2Math_1.b2Vec2.SubVV(cA, b2Math_1.b2Rot.MulRV(xfA.q, localCenterA, b2Math_1.b2Vec2.s_t0), xfA.p);
                        b2Math_1.b2Vec2.SubVV(cB, b2Math_1.b2Rot.MulRV(xfB.q, localCenterB, b2Math_1.b2Vec2.s_t0), xfB.p);
                        worldManifold.Initialize(manifold, xfA, radiusA, xfB, radiusB);
                        vc.normal.Copy(worldManifold.normal);
                        b2Math_1.b2Vec2.CrossVOne(vc.normal, vc.tangent); // compute from normal
                        const pointCount = vc.pointCount;
                        for (let j = 0; j < pointCount; ++j) {
                            const vcp = vc.points[j];
                            // vcp->rA = worldManifold.points[j] - cA;
                            b2Math_1.b2Vec2.SubVV(worldManifold.points[j], cA, vcp.rA);
                            // vcp->rB = worldManifold.points[j] - cB;
                            b2Math_1.b2Vec2.SubVV(worldManifold.points[j], cB, vcp.rB);
                            const rnA = b2Math_1.b2Vec2.CrossVV(vcp.rA, vc.normal);
                            const rnB = b2Math_1.b2Vec2.CrossVV(vcp.rB, vc.normal);
                            const kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            vcp.normalMass = kNormal > 0 ? 1 / kNormal : 0;
                            // b2Vec2 tangent = b2Cross(vc->normal, 1.0f);
                            const tangent = vc.tangent; // precomputed from normal
                            const rtA = b2Math_1.b2Vec2.CrossVV(vcp.rA, tangent);
                            const rtB = b2Math_1.b2Vec2.CrossVV(vcp.rB, tangent);
                            const kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;
                            vcp.tangentMass = kTangent > 0 ? 1 / kTangent : 0;
                            // Setup a velocity bias for restitution.
                            vcp.velocityBias = 0;
                            // float32 vRel = b2Dot(vc->normal, vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA));
                            const vRel = b2Math_1.b2Vec2.DotVV(vc.normal, b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_1.b2Vec2.s_t1), b2Math_1.b2Vec2.s_t0));
                            if (vRel < (-b2Settings_1.b2_velocityThreshold)) {
                                vcp.velocityBias += (-vc.restitution * vRel);
                            }
                        }
                        // If we have two points, then prepare the block solver.
                        if (vc.pointCount === 2) {
                            const vcp1 = vc.points[0];
                            const vcp2 = vc.points[1];
                            const rn1A = b2Math_1.b2Vec2.CrossVV(vcp1.rA, vc.normal);
                            const rn1B = b2Math_1.b2Vec2.CrossVV(vcp1.rB, vc.normal);
                            const rn2A = b2Math_1.b2Vec2.CrossVV(vcp2.rA, vc.normal);
                            const rn2B = b2Math_1.b2Vec2.CrossVV(vcp2.rB, vc.normal);
                            const k11 = mA + mB + iA * rn1A * rn1A + iB * rn1B * rn1B;
                            const k22 = mA + mB + iA * rn2A * rn2A + iB * rn2B * rn2B;
                            const k12 = mA + mB + iA * rn1A * rn2A + iB * rn1B * rn2B;
                            // Ensure a reasonable condition number.
                            // float32 k_maxConditionNumber = 1000.0f;
                            if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
                                // K is safe to invert.
                                vc.K.ex.Set(k11, k12);
                                vc.K.ey.Set(k12, k22);
                                vc.K.GetInverse(vc.normalMass);
                            }
                            else {
                                // The constraints are redundant, just use one.
                                // TODO_ERIN use deepest?
                                vc.pointCount = 1;
                            }
                        }
                    }
                }
                WarmStart() {
                    const P = b2ContactSolver.WarmStart_s_P;
                    // Warm start.
                    for (let i = 0; i < this.m_count; ++i) {
                        const vc = this.m_velocityConstraints[i];
                        const indexA = vc.indexA;
                        const indexB = vc.indexB;
                        const mA = vc.invMassA;
                        const iA = vc.invIA;
                        const mB = vc.invMassB;
                        const iB = vc.invIB;
                        const pointCount = vc.pointCount;
                        const vA = this.m_velocities[indexA].v;
                        let wA = this.m_velocities[indexA].w;
                        const vB = this.m_velocities[indexB].v;
                        let wB = this.m_velocities[indexB].w;
                        const normal = vc.normal;
                        // b2Vec2 tangent = b2Cross(normal, 1.0f);
                        const tangent = vc.tangent; // precomputed from normal
                        for (let j = 0; j < pointCount; ++j) {
                            const vcp = vc.points[j];
                            // b2Vec2 P = vcp->normalImpulse * normal + vcp->tangentImpulse * tangent;
                            b2Math_1.b2Vec2.AddVV(b2Math_1.b2Vec2.MulSV(vcp.normalImpulse, normal, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.MulSV(vcp.tangentImpulse, tangent, b2Math_1.b2Vec2.s_t1), P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_1.b2Vec2.CrossVV(vcp.rA, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_1.b2Vec2.CrossVV(vcp.rB, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                        }
                        // this.m_velocities[indexA].v = vA;
                        this.m_velocities[indexA].w = wA;
                        // this.m_velocities[indexB].v = vB;
                        this.m_velocities[indexB].w = wB;
                    }
                }
                SolveVelocityConstraints() {
                    const dv = b2ContactSolver.SolveVelocityConstraints_s_dv;
                    const dv1 = b2ContactSolver.SolveVelocityConstraints_s_dv1;
                    const dv2 = b2ContactSolver.SolveVelocityConstraints_s_dv2;
                    const P = b2ContactSolver.SolveVelocityConstraints_s_P;
                    const a = b2ContactSolver.SolveVelocityConstraints_s_a;
                    const b = b2ContactSolver.SolveVelocityConstraints_s_b;
                    const x = b2ContactSolver.SolveVelocityConstraints_s_x;
                    const d = b2ContactSolver.SolveVelocityConstraints_s_d;
                    const P1 = b2ContactSolver.SolveVelocityConstraints_s_P1;
                    const P2 = b2ContactSolver.SolveVelocityConstraints_s_P2;
                    const P1P2 = b2ContactSolver.SolveVelocityConstraints_s_P1P2;
                    for (let i = 0; i < this.m_count; ++i) {
                        const vc = this.m_velocityConstraints[i];
                        const indexA = vc.indexA;
                        const indexB = vc.indexB;
                        const mA = vc.invMassA;
                        const iA = vc.invIA;
                        const mB = vc.invMassB;
                        const iB = vc.invIB;
                        const pointCount = vc.pointCount;
                        const vA = this.m_velocities[indexA].v;
                        let wA = this.m_velocities[indexA].w;
                        const vB = this.m_velocities[indexB].v;
                        let wB = this.m_velocities[indexB].w;
                        // b2Vec2 normal = vc->normal;
                        const normal = vc.normal;
                        // b2Vec2 tangent = b2Cross(normal, 1.0f);
                        const tangent = vc.tangent; // precomputed from normal
                        const friction = vc.friction;
                        // DEBUG: b2Assert(pointCount === 1 || pointCount === 2);
                        // Solve tangent constraints first because non-penetration is more important
                        // than friction.
                        for (let j = 0; j < pointCount; ++j) {
                            const vcp = vc.points[j];
                            // Relative velocity at contact
                            // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                            b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_1.b2Vec2.s_t1), dv);
                            // Compute tangent force
                            // float32 vt = b2Dot(dv, tangent) - vc->tangentSpeed;
                            const vt = b2Math_1.b2Vec2.DotVV(dv, tangent) - vc.tangentSpeed;
                            let lambda = vcp.tangentMass * (-vt);
                            // b2Clamp the accumulated force
                            const maxFriction = friction * vcp.normalImpulse;
                            const newImpulse = b2Math_1.b2Clamp(vcp.tangentImpulse + lambda, (-maxFriction), maxFriction);
                            lambda = newImpulse - vcp.tangentImpulse;
                            vcp.tangentImpulse = newImpulse;
                            // Apply contact impulse
                            // b2Vec2 P = lambda * tangent;
                            b2Math_1.b2Vec2.MulSV(lambda, tangent, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_1.b2Vec2.CrossVV(vcp.rA, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_1.b2Vec2.CrossVV(vcp.rB, P);
                        }
                        // Solve normal constraints
                        if (vc.pointCount === 1) {
                            const vcp = vc.points[0];
                            // Relative velocity at contact
                            // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                            b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_1.b2Vec2.s_t1), dv);
                            // Compute normal impulse
                            // float32 vn = b2Dot(dv, normal);
                            const vn = b2Math_1.b2Vec2.DotVV(dv, normal);
                            let lambda = (-vcp.normalMass * (vn - vcp.velocityBias));
                            // b2Clamp the accumulated impulse
                            // float32 newImpulse = b2Max(vcp->normalImpulse + lambda, 0.0f);
                            const newImpulse = b2Math_1.b2Max(vcp.normalImpulse + lambda, 0);
                            lambda = newImpulse - vcp.normalImpulse;
                            vcp.normalImpulse = newImpulse;
                            // Apply contact impulse
                            // b2Vec2 P = lambda * normal;
                            b2Math_1.b2Vec2.MulSV(lambda, normal, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_1.b2Vec2.CrossVV(vcp.rA, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_1.b2Vec2.CrossVV(vcp.rB, P);
                        }
                        else {
                            // Block solver developed in collaboration with Dirk Gregorius (back in 01/07 on Box2D_Lite).
                            // Build the mini LCP for this contact patch
                            //
                            // vn = A * x + b, vn >= 0, , vn >= 0, x >= 0 and vn_i * x_i = 0 with i = 1..2
                            //
                            // A = J * W * JT and J = ( -n, -r1 x n, n, r2 x n )
                            // b = vn0 - velocityBias
                            //
                            // The system is solved using the "Total enumeration method" (s. Murty). The complementary constraint vn_i * x_i
                            // implies that we must have in any solution either vn_i = 0 or x_i = 0. So for the 2D contact problem the cases
                            // vn1 = 0 and vn2 = 0, x1 = 0 and x2 = 0, x1 = 0 and vn2 = 0, x2 = 0 and vn1 = 0 need to be tested. The first valid
                            // solution that satisfies the problem is chosen.
                            //
                            // In order to account of the accumulated impulse 'a' (because of the iterative nature of the solver which only requires
                            // that the accumulated impulse is clamped and not the incremental impulse) we change the impulse variable (x_i).
                            //
                            // Substitute:
                            //
                            // x = a + d
                            //
                            // a := old total impulse
                            // x := new total impulse
                            // d := incremental impulse
                            //
                            // For the current iteration we extend the formula for the incremental impulse
                            // to compute the new total impulse:
                            //
                            // vn = A * d + b
                            //    = A * (x - a) + b
                            //    = A * x + b - A * a
                            //    = A * x + b'
                            // b' = b - A * a;
                            const cp1 = vc.points[0];
                            const cp2 = vc.points[1];
                            // b2Vec2 a(cp1->normalImpulse, cp2->normalImpulse);
                            a.Set(cp1.normalImpulse, cp2.normalImpulse);
                            // DEBUG: b2Assert(a.x >= 0 && a.y >= 0);
                            // Relative velocity at contact
                            // b2Vec2 dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                            b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, cp1.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, cp1.rA, b2Math_1.b2Vec2.s_t1), dv1);
                            // b2Vec2 dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                            b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, cp2.rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, cp2.rA, b2Math_1.b2Vec2.s_t1), dv2);
                            // Compute normal velocity
                            // float32 vn1 = b2Dot(dv1, normal);
                            let vn1 = b2Math_1.b2Vec2.DotVV(dv1, normal);
                            // float32 vn2 = b2Dot(dv2, normal);
                            let vn2 = b2Math_1.b2Vec2.DotVV(dv2, normal);
                            // b2Vec2 b;
                            b.x = vn1 - cp1.velocityBias;
                            b.y = vn2 - cp2.velocityBias;
                            // Compute b'
                            // b -= b2Mul(vc->K, a);
                            b.SelfSub(b2Math_1.b2Mat22.MulMV(vc.K, a, b2Math_1.b2Vec2.s_t0));
                            /*
                            #if B2_DEBUG_SOLVER === 1
                            const k_errorTol: number = 0.001;
                            #endif
                            */
                            for (;;) {
                                //
                                // Case 1: vn = 0
                                //
                                // 0 = A * x + b'
                                //
                                // Solve for x:
                                //
                                // x = - inv(A) * b'
                                //
                                // b2Vec2 x = - b2Mul(vc->normalMass, b);
                                b2Math_1.b2Mat22.MulMV(vc.normalMass, b, x).SelfNeg();
                                if (x.x >= 0 && x.y >= 0) {
                                    // Get the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                                    dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                        
                                    // Compute normal velocity
                                    vn1 = b2Dot(dv1, normal);
                                    vn2 = b2Dot(dv2, normal);
                        
                                    b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol);
                                    b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol);
                                    #endif
                                    */
                                    break;
                                }
                                //
                                // Case 2: vn1 = 0 and x2 = 0
                                //
                                //   0 = a11 * x1 + a12 * 0 + b1'
                                // vn2 = a21 * x1 + a22 * 0 + b2'
                                //
                                x.x = (-cp1.normalMass * b.x);
                                x.y = 0;
                                vn1 = 0;
                                vn2 = vc.K.ex.y * x.x + b.y;
                                if (x.x >= 0 && vn2 >= 0) {
                                    // Get the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                        
                                    // Compute normal velocity
                                    vn1 = b2Dot(dv1, normal);
                        
                                    b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol);
                                    #endif
                                    */
                                    break;
                                }
                                //
                                // Case 3: vn2 = 0 and x1 = 0
                                //
                                // vn1 = a11 * 0 + a12 * x2 + b1'
                                //   0 = a21 * 0 + a22 * x2 + b2'
                                //
                                x.x = 0;
                                x.y = (-cp2.normalMass * b.y);
                                vn1 = vc.K.ey.x * x.y + b.x;
                                vn2 = 0;
                                if (x.y >= 0 && vn1 >= 0) {
                                    // Resubstitute for the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                        
                                    // Compute normal velocity
                                    vn2 = b2Dot(dv2, normal);
                        
                                    b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol);
                                    #endif
                                    */
                                    break;
                                }
                                //
                                // Case 4: x1 = 0 and x2 = 0
                                //
                                // vn1 = b1
                                // vn2 = b2;
                                x.x = 0;
                                x.y = 0;
                                vn1 = b.x;
                                vn2 = b.y;
                                if (vn1 >= 0 && vn2 >= 0) {
                                    // Resubstitute for the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_1.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_1.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_1.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_1.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_1.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_1.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_1.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    break;
                                }
                                // No solution, give up. This is hit sometimes, but it doesn't seem to matter.
                                break;
                            }
                        }
                        // this.m_velocities[indexA].v = vA;
                        this.m_velocities[indexA].w = wA;
                        // this.m_velocities[indexB].v = vB;
                        this.m_velocities[indexB].w = wB;
                    }
                }
                StoreImpulses() {
                    for (let i = 0; i < this.m_count; ++i) {
                        const vc = this.m_velocityConstraints[i];
                        const manifold = this.m_contacts[vc.contactIndex].GetManifold();
                        for (let j = 0; j < vc.pointCount; ++j) {
                            manifold.points[j].normalImpulse = vc.points[j].normalImpulse;
                            manifold.points[j].tangentImpulse = vc.points[j].tangentImpulse;
                        }
                    }
                }
                SolvePositionConstraints() {
                    const xfA = b2ContactSolver.SolvePositionConstraints_s_xfA;
                    const xfB = b2ContactSolver.SolvePositionConstraints_s_xfB;
                    const psm = b2ContactSolver.SolvePositionConstraints_s_psm;
                    const rA = b2ContactSolver.SolvePositionConstraints_s_rA;
                    const rB = b2ContactSolver.SolvePositionConstraints_s_rB;
                    const P = b2ContactSolver.SolvePositionConstraints_s_P;
                    let minSeparation = 0;
                    for (let i = 0; i < this.m_count; ++i) {
                        const pc = this.m_positionConstraints[i];
                        const indexA = pc.indexA;
                        const indexB = pc.indexB;
                        const localCenterA = pc.localCenterA;
                        const mA = pc.invMassA;
                        const iA = pc.invIA;
                        const localCenterB = pc.localCenterB;
                        const mB = pc.invMassB;
                        const iB = pc.invIB;
                        const pointCount = pc.pointCount;
                        const cA = this.m_positions[indexA].c;
                        let aA = this.m_positions[indexA].a;
                        const cB = this.m_positions[indexB].c;
                        let aB = this.m_positions[indexB].a;
                        // Solve normal constraints
                        for (let j = 0; j < pointCount; ++j) {
                            xfA.q.SetAngle(aA);
                            xfB.q.SetAngle(aB);
                            b2Math_1.b2Vec2.SubVV(cA, b2Math_1.b2Rot.MulRV(xfA.q, localCenterA, b2Math_1.b2Vec2.s_t0), xfA.p);
                            b2Math_1.b2Vec2.SubVV(cB, b2Math_1.b2Rot.MulRV(xfB.q, localCenterB, b2Math_1.b2Vec2.s_t0), xfB.p);
                            psm.Initialize(pc, xfA, xfB, j);
                            const normal = psm.normal;
                            const point = psm.point;
                            const separation = psm.separation;
                            // b2Vec2 rA = point - cA;
                            b2Math_1.b2Vec2.SubVV(point, cA, rA);
                            // b2Vec2 rB = point - cB;
                            b2Math_1.b2Vec2.SubVV(point, cB, rB);
                            // Track max constraint error.
                            minSeparation = b2Math_1.b2Min(minSeparation, separation);
                            // Prevent large corrections and allow slop.
                            const C = b2Math_1.b2Clamp(b2Settings_1.b2_baumgarte * (separation + b2Settings_1.b2_linearSlop), (-b2Settings_1.b2_maxLinearCorrection), 0);
                            // Compute the effective mass.
                            // float32 rnA = b2Cross(rA, normal);
                            const rnA = b2Math_1.b2Vec2.CrossVV(rA, normal);
                            // float32 rnB = b2Cross(rB, normal);
                            const rnB = b2Math_1.b2Vec2.CrossVV(rB, normal);
                            // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            const K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            // Compute normal impulse
                            const impulse = K > 0 ? -C / K : 0;
                            // b2Vec2 P = impulse * normal;
                            b2Math_1.b2Vec2.MulSV(impulse, normal, P);
                            // cA -= mA * P;
                            cA.SelfMulSub(mA, P);
                            // aA -= iA * b2Cross(rA, P);
                            aA -= iA * b2Math_1.b2Vec2.CrossVV(rA, P);
                            // cB += mB * P;
                            cB.SelfMulAdd(mB, P);
                            // aB += iB * b2Cross(rB, P);
                            aB += iB * b2Math_1.b2Vec2.CrossVV(rB, P);
                        }
                        // this.m_positions[indexA].c = cA;
                        this.m_positions[indexA].a = aA;
                        // this.m_positions[indexB].c = cB;
                        this.m_positions[indexB].a = aB;
                    }
                    // We can't expect minSpeparation >= -b2_linearSlop because we don't
                    // push the separation above -b2_linearSlop.
                    return minSeparation > (-3 * b2Settings_1.b2_linearSlop);
                }
                SolveTOIPositionConstraints(toiIndexA, toiIndexB) {
                    const xfA = b2ContactSolver.SolveTOIPositionConstraints_s_xfA;
                    const xfB = b2ContactSolver.SolveTOIPositionConstraints_s_xfB;
                    const psm = b2ContactSolver.SolveTOIPositionConstraints_s_psm;
                    const rA = b2ContactSolver.SolveTOIPositionConstraints_s_rA;
                    const rB = b2ContactSolver.SolveTOIPositionConstraints_s_rB;
                    const P = b2ContactSolver.SolveTOIPositionConstraints_s_P;
                    let minSeparation = 0;
                    for (let i = 0; i < this.m_count; ++i) {
                        const pc = this.m_positionConstraints[i];
                        const indexA = pc.indexA;
                        const indexB = pc.indexB;
                        const localCenterA = pc.localCenterA;
                        const localCenterB = pc.localCenterB;
                        const pointCount = pc.pointCount;
                        let mA = 0;
                        let iA = 0;
                        if (indexA === toiIndexA || indexA === toiIndexB) {
                            mA = pc.invMassA;
                            iA = pc.invIA;
                        }
                        let mB = 0;
                        let iB = 0;
                        if (indexB === toiIndexA || indexB === toiIndexB) {
                            mB = pc.invMassB;
                            iB = pc.invIB;
                        }
                        const cA = this.m_positions[indexA].c;
                        let aA = this.m_positions[indexA].a;
                        const cB = this.m_positions[indexB].c;
                        let aB = this.m_positions[indexB].a;
                        // Solve normal constraints
                        for (let j = 0; j < pointCount; ++j) {
                            xfA.q.SetAngle(aA);
                            xfB.q.SetAngle(aB);
                            b2Math_1.b2Vec2.SubVV(cA, b2Math_1.b2Rot.MulRV(xfA.q, localCenterA, b2Math_1.b2Vec2.s_t0), xfA.p);
                            b2Math_1.b2Vec2.SubVV(cB, b2Math_1.b2Rot.MulRV(xfB.q, localCenterB, b2Math_1.b2Vec2.s_t0), xfB.p);
                            psm.Initialize(pc, xfA, xfB, j);
                            const normal = psm.normal;
                            const point = psm.point;
                            const separation = psm.separation;
                            // b2Vec2 rA = point - cA;
                            b2Math_1.b2Vec2.SubVV(point, cA, rA);
                            // b2Vec2 rB = point - cB;
                            b2Math_1.b2Vec2.SubVV(point, cB, rB);
                            // Track max constraint error.
                            minSeparation = b2Math_1.b2Min(minSeparation, separation);
                            // Prevent large corrections and allow slop.
                            const C = b2Math_1.b2Clamp(b2Settings_1.b2_toiBaumgarte * (separation + b2Settings_1.b2_linearSlop), (-b2Settings_1.b2_maxLinearCorrection), 0);
                            // Compute the effective mass.
                            // float32 rnA = b2Cross(rA, normal);
                            const rnA = b2Math_1.b2Vec2.CrossVV(rA, normal);
                            // float32 rnB = b2Cross(rB, normal);
                            const rnB = b2Math_1.b2Vec2.CrossVV(rB, normal);
                            // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            const K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            // Compute normal impulse
                            const impulse = K > 0 ? -C / K : 0;
                            // b2Vec2 P = impulse * normal;
                            b2Math_1.b2Vec2.MulSV(impulse, normal, P);
                            // cA -= mA * P;
                            cA.SelfMulSub(mA, P);
                            // aA -= iA * b2Cross(rA, P);
                            aA -= iA * b2Math_1.b2Vec2.CrossVV(rA, P);
                            // cB += mB * P;
                            cB.SelfMulAdd(mB, P);
                            // aB += iB * b2Cross(rB, P);
                            aB += iB * b2Math_1.b2Vec2.CrossVV(rB, P);
                        }
                        // this.m_positions[indexA].c = cA;
                        this.m_positions[indexA].a = aA;
                        // this.m_positions[indexB].c = cB;
                        this.m_positions[indexB].a = aB;
                    }
                    // We can't expect minSpeparation >= -b2_linearSlop because we don't
                    // push the separation above -b2_linearSlop.
                    return minSeparation >= -1.5 * b2Settings_1.b2_linearSlop;
                }
            };
            b2ContactSolver.InitializeVelocityConstraints_s_xfA = new b2Math_1.b2Transform();
            b2ContactSolver.InitializeVelocityConstraints_s_xfB = new b2Math_1.b2Transform();
            b2ContactSolver.InitializeVelocityConstraints_s_worldManifold = new b2Collision_1.b2WorldManifold();
            b2ContactSolver.WarmStart_s_P = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv1 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv2 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_a = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_b = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_x = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_d = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P1 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P2 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P1P2 = new b2Math_1.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_xfA = new b2Math_1.b2Transform();
            b2ContactSolver.SolvePositionConstraints_s_xfB = new b2Math_1.b2Transform();
            b2ContactSolver.SolvePositionConstraints_s_psm = new b2PositionSolverManifold();
            b2ContactSolver.SolvePositionConstraints_s_rA = new b2Math_1.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_rB = new b2Math_1.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_P = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_xfA = new b2Math_1.b2Transform();
            b2ContactSolver.SolveTOIPositionConstraints_s_xfB = new b2Math_1.b2Transform();
            b2ContactSolver.SolveTOIPositionConstraints_s_psm = new b2PositionSolverManifold();
            b2ContactSolver.SolveTOIPositionConstraints_s_rA = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_rB = new b2Math_1.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_P = new b2Math_1.b2Vec2();
            exports_1("b2ContactSolver", b2ContactSolver);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0U29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vQm94MkQvRHluYW1pY3MvQ29udGFjdHMvYjJDb250YWN0U29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBZUYsNEJBQUE7Z0JBQUE7b0JBQ2tCLE9BQUUsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUMxQixPQUFFLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDbkMsa0JBQWEsR0FBVyxDQUFDLENBQUM7b0JBQzFCLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUMzQixlQUFVLEdBQVcsQ0FBQyxDQUFDO29CQUN2QixnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFDeEIsaUJBQVksR0FBVyxDQUFDLENBQUM7Z0JBS2xDLENBQUM7Z0JBSFEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO29CQUNwQyxPQUFPLHdCQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLHlCQUF5QixFQUFFLENBQUMsQ0FBQztnQkFDN0UsQ0FBQzthQUNGLENBQUE7O1lBRUQsOEJBQUE7Z0JBQUE7b0JBQ1MsV0FBTSxHQUFnQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsaUNBQW9CLENBQUMsQ0FBQztvQkFDdkYsV0FBTSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQzlCLFlBQU8sR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUMvQixlQUFVLEdBQVksSUFBSSxnQkFBTyxFQUFFLENBQUM7b0JBQ3BDLE1BQUMsR0FBWSxJQUFJLGdCQUFPLEVBQUUsQ0FBQztvQkFDcEMsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFDbkIsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFDbkIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsYUFBUSxHQUFX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